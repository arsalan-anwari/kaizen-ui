<script lang="ts">
  import { IconButton } from "kaizen-ui";
  import { highlight } from "../highlight";

  let {
    code,
    lang = "svelte"
  }: {
    code: string;
    lang?: string;
  } = $props();

  let html = $state("");
  let copied = $state(false);
  let timer: ReturnType<typeof setTimeout> | undefined;

  $effect(() => {
    let live = true;
    void highlight(code, lang).then((out) => {
      if (live) html = out;
    });
    return () => {
      live = false;
    };
  });

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(code);
    copied = true;
    clearTimeout(timer);
    timer = setTimeout(() => (copied = false), 1400);
  }
</script>

<div class="code-block relative">
  <IconButton
    class="absolute top-1.5 right-1.5 z-10"
    icon={copied ? "check" : "copy"}
    label={copied ? "Copied" : "Copy code"}
    variant="ghost"
    size="sm"
    onclick={copy}
  />
  {#if html === ""}
    <pre>{code}</pre>
  {:else}
    <!-- eslint-disable-next-line svelte/no-at-html-tags : shiki output over our own source files -->
    {@html html}
  {/if}
</div>
