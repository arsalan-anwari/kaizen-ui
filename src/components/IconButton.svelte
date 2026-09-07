<script lang="ts">
  import { sfx } from "../sfx";
  import Icon from "./Icon.svelte";
  import type { IconName } from "./icons";

  let {
    icon,
    label,
    active = false,
    disabled = false,
    size = "md",
    variant = "outline",
    class: className = "",
    onclick
  }: {
    icon: IconName;
    label: string;
    active?: boolean;
    disabled?: boolean;
    size?: "sm" | "md";
    variant?: "outline" | "ghost" | "danger";
    class?: string;
    onclick?: () => void;
  } = $props();

  const sizes = { sm: "size-10 rounded-lg", md: "size-12 rounded-xl" };

  const variants = {
    outline:
      "lip press border border-wire bg-surface text-foreground [--lip:var(--color-wire)] hover:border-selected",
    ghost: "text-muted-foreground hover:bg-accent hover:text-foreground active:translate-y-[1px]",
    danger: "border-2 border-danger bg-danger-soft text-danger active:translate-y-[1px]"
  };

  function handle(): void {
    if (disabled) return;
    sfx.click();
    onclick?.();
  }
</script>

<button
  type="button"
  title={label}
  aria-label={label}
  aria-pressed={active}
  {disabled}
  class="inline-flex shrink-0 cursor-pointer items-center justify-center transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 {sizes[
    size
  ]} {className} {active
    ? 'border-2 border-selected bg-selected-soft text-selected'
    : variants[variant]}"
  onclick={handle}
>
  <Icon name={icon} class={size === "sm" ? "size-4.5" : "size-5.5"} />
</button>
