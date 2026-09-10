import type { HighlighterCore } from "shiki/core";

let highlighter: Promise<HighlighterCore> | null = null;

function load(): Promise<HighlighterCore> {
  highlighter ??= (async () => {
    const [core, engine, svelte, bash, css, light, dark] = await Promise.all([
      import("shiki/core"),
      import("shiki/engine/javascript"),
      import("shiki/langs/svelte.mjs"),
      import("shiki/langs/bash.mjs"),
      import("shiki/langs/css.mjs"),
      import("shiki/themes/vitesse-light.mjs"),
      import("shiki/themes/vitesse-dark.mjs")
    ]);
    return core.createHighlighterCore({
      langs: [svelte.default, bash.default, css.default],
      themes: [light.default, dark.default],
      engine: engine.createJavaScriptRegexEngine({ forgiving: true })
    });
  })();
  return highlighter;
}

export async function highlight(code: string, lang: string): Promise<string> {
  const shiki = await load();
  return shiki.codeToHtml(code, {
    lang,
    themes: { light: "vitesse-light", dark: "vitesse-dark" },
    defaultColor: "light"
  });
}
