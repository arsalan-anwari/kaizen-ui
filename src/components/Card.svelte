<script lang="ts">
  import type { Snippet } from "svelte";

  let {
    title = "",
    description = "",
    icon,
    class: className = "",
    contentClass = "",
    children,
    action
  }: {
    title?: string;
    description?: string;
    icon?: Snippet;
    class?: string;
    contentClass?: string;
    children: Snippet;
    action?: Snippet;
  } = $props();

  const hasHeader = $derived(title !== "" || action !== undefined);
</script>

<section class="sheet ruled rounded-2xl border-2 border-border bg-surface {className}">
  {#if hasHeader}
    <header class="flex flex-wrap items-start justify-between gap-4 px-5 pt-5 pb-4 sm:px-6 sm:pt-6">
      <div class="flex min-w-0 items-start gap-3.5">
        {#if icon}
          <span
            class="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand"
          >
            {@render icon()}
          </span>
        {/if}
        <div class="flex min-w-0 flex-col gap-1">
          <h3 class="text-h4 font-bold leading-tight tracking-tight">{title}</h3>
          {#if description !== ""}
            <p class="text-sm leading-snug text-muted-foreground">{description}</p>
          {/if}
        </div>
      </div>
      {#if action}
        <div class="flex shrink-0 items-center gap-2">{@render action()}</div>
      {/if}
    </header>
  {/if}
  <div class="px-5 pb-5 sm:px-6 sm:pb-6 {hasHeader ? '' : 'pt-5 sm:pt-6'} {contentClass}">
    {@render children()}
  </div>
</section>
