<script lang="ts" generics="T extends string">
  import Button from "./Button.svelte";

  // A strip of mutually exclusive tabs.

  let {
    items,
    value,
    size = "sm",
    full = false,
    class: className = "",
    onpick
  }: {
    items: { value: T; label: string }[];
    value: T;
    size?: "sm" | "md";
    full?: boolean;
    class?: string;
    onpick: (value: T) => void;
  } = $props();

  // has to match the rounding Button gives each size
  const inner = { sm: "var(--radius-lg)", md: "var(--radius-xl)" };
  const pad = { sm: "0.25rem", md: "0.3125rem" };
</script>

<div
  role="tablist"
  class="inline-flex max-w-full gap-1 overflow-x-auto border-2 border-wire bg-surface {full
    ? 'flex'
    : ''} {className}"
  style="padding: {pad[size]}; border-radius: calc({inner[size]} + {pad[size]})"
>
  {#each items as item (item.value)}
    <Button
      {size}
      raised={false}
      class={full ? "flex-1" : ""}
      variant={item.value === value ? "brand" : "ghost"}
      onclick={() => onpick(item.value)}
    >
      {item.label}
    </Button>
  {/each}
</div>
