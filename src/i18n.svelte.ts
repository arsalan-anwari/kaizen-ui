// String lookup for an app that ships its own translation files.
//
// The app hands over one dictionary per locale tag, then every key is
// "<namespace>.<path.through.the.file>", e.g. "setup.start".

export type Dict = { [key: string]: string | Dict };

export type Locale = { tag: string; name: string };

let bundles: Record<string, Dict> = {};
let locales: Locale[] = [];
let fallback = "en";

export const i18n = $state({ locale: fallback });

export function knownLocales(): Locale[] {
  return locales;
}

// Splits a Vite glob of `<root>/<tag>/<namespace>.json` into one dictionary per
// tag, which is how an app usually keeps its strings on disk.
export function bundlesFromGlob(files: Record<string, Dict>): Record<string, Dict> {
  const out: Record<string, Dict> = {};
  for (const [path, data] of Object.entries(files)) {
    const parts = /\/([^/]+)\/([^/]+)\.json$/.exec(path);
    if (parts === null) continue;
    (out[parts[1]] ??= {})[parts[2]] = data;
  }
  return out;
}

export function registerLocales(options: {
  bundles: Record<string, Dict>;
  locales: Locale[];
  fallback?: string;
}): void {
  bundles = options.bundles;
  locales = options.locales;
  fallback = options.fallback ?? locales[0]?.tag ?? "en";
  i18n.locale = fallback;
}

// "auto" and anything unknown resolve against the browser, then to the fallback.
export function resolveLocale(wanted: string): string {
  const tags = locales.map((locale) => locale.tag);
  if (tags.includes(wanted)) return wanted;
  const preferred = typeof navigator === "undefined" ? [] : [...navigator.languages];
  for (const candidate of preferred) {
    if (tags.includes(candidate)) return candidate;
    // en-GB counts as en, pt-PT as pt-BR: first tag sharing the base language
    const base = candidate.split("-")[0];
    const near = tags.find((tag) => tag.split("-")[0] === base);
    if (near !== undefined) return near;
  }
  return fallback;
}

export function setLocale(wanted: string): void {
  i18n.locale = resolveLocale(wanted);
  if (typeof document !== "undefined") document.documentElement.lang = i18n.locale;
}

function lookup(locale: string, key: string): string | null {
  let node: string | Dict | undefined = bundles[locale];
  for (const step of key.split(".")) {
    if (node === undefined || typeof node === "string") return null;
    node = node[step];
  }
  return typeof node === "string" ? node : null;
}

export type Params = Record<string, string | number>;

// Falls back to the fallback locale, then to the key itself so a missing string
// is obvious rather than blank. A numeric "count" picks the plural form,
// e.g. runs_one / runs_other.
export function t(key: string, params: Params = {}): string {
  const locale = i18n.locale;
  const count = params.count;

  const keys: string[] = [];
  if (typeof count === "number") {
    keys.push(`${key}_${new Intl.PluralRules(locale).select(count)}`, `${key}_other`);
  }
  keys.push(key);

  let text: string | null = null;
  for (const candidate of keys) {
    text = lookup(locale, candidate) ?? lookup(fallback, candidate);
    if (text !== null) break;
  }
  if (text === null) return key;

  return text.replace(/\{(\w+)\}/g, (whole, name: string) =>
    name in params ? String(params[name]) : whole
  );
}

// A number written the way the current locale writes numbers.
export function n(value: number): string {
  return new Intl.NumberFormat(i18n.locale).format(value);
}
