<script lang="ts">
  import type { Snippet } from "svelte";
  import { sfx } from "../sfx";

  type Variant =
    "primary" | "brand" | "seal" | "secondary" | "outline" | "ghost" | "success" | "danger";
  type Size = "sm" | "md" | "lg" | "xl";

  let {
    variant = "primary",
    size = "md",
    disabled = false,
    raised = true,
    type = "button",
    title = "",
    full = false,
    wrap = false,
    silent = false,
    class: className = "",
    onclick,
    children,
    ...rest
  }: {
    variant?: Variant;
    size?: Size;
    disabled?: boolean;
    raised?: boolean;
    type?: "button" | "submit";
    title?: string;
    full?: boolean;
    wrap?: boolean;
    silent?: boolean;
    class?: string;
    onclick?: () => void;
    children: Snippet;
    [key: string]: unknown;
  } = $props();

  const base =
    "inline-flex items-center justify-center gap-2 font-bold tracking-tight select-none cursor-pointer transition-[transform,box-shadow,background-color,color,opacity] duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40";

  const lip = $derived(raised ? "lip press hover:brightness-105" : "hover:brightness-105");

  const variants: Record<Variant, string> = $derived({
    primary: `bg-primary text-primary-foreground [--lip:var(--brand-shadow)] ${lip}`,
    brand: `bg-brand text-brand-foreground [--lip:var(--brand-shadow)] ${lip}`,
    seal: `bg-seal text-seal-foreground [--lip:color-mix(in_srgb,var(--seal)_65%,black)] ${lip}`,
    success: `bg-success text-success-foreground [--lip:color-mix(in_srgb,var(--success)_65%,black)] ${lip}`,
    danger: `bg-danger text-danger-foreground [--lip:color-mix(in_srgb,var(--danger)_65%,black)] ${lip}`,
    secondary:
      "lip press border border-wire bg-secondary text-secondary-foreground [--lip:var(--color-wire)] hover:bg-accent",
    outline:
      "lip press border border-wire bg-surface text-foreground [--lip:var(--color-wire)] hover:border-selected hover:bg-accent",
    ghost: "press text-foreground hover:bg-accent"
  });

  const sizes: Record<Size, string> = {
    sm: "px-4 text-sm rounded-lg",
    md: "px-5 text-base rounded-xl",
    lg: "px-7 text-base rounded-xl",
    xl: "px-9 text-h3 rounded-2xl"
  };

  const heights: Record<Size, string> = {
    sm: "h-10",
    md: "h-12",
    lg: "h-14",
    xl: "h-17"
  };

  const wrapping: Record<Size, string> = {
    sm: "min-h-10 py-1.5",
    md: "min-h-12 py-2",
    lg: "min-h-14 py-2",
    xl: "min-h-17 py-2.5"
  };

  function handle(): void {
    if (!silent) sfx.click();
    onclick?.();
  }
</script>

<button
  {type}
  {title}
  {disabled}
  class="{base} {variants[variant]} {sizes[size]} {wrap
    ? `${wrapping[size]} max-w-full text-center hyphens-auto [overflow-wrap:anywhere]`
    : heights[size]} {full ? 'w-full' : ''} {className}"
  onclick={handle}
  {...rest}
>
  {@render children()}
</button>
