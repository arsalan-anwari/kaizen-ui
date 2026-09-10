<script lang="ts">
  import type { Component } from "svelte";
  import { Segmented } from "kaizen-ui";
  import Code from "./Code.svelte";

  let {
    name,
    note,
    demo,
    source
  }: {
    name: string;
    note: string;
    demo: Component;
    source: string;
  } = $props();

  let tab = $state<"preview" | "code">("preview");

  const Preview = $derived(demo);
</script>

<section id={name.toLowerCase()} class="scroll-mt-24">
  <div class="mb-3 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
    <div class="min-w-0">
      <h2 class="text-h3 font-bold tracking-tight">
        <a class="hover:underline" href="#{name.toLowerCase()}">{name}</a>
      </h2>
      <p class="text-sm text-foreground/75">{note}</p>
    </div>
    <Segmented
      items={[
        { value: "preview", label: "Preview" },
        { value: "code", label: "Code" }
      ]}
      value={tab}
      onpick={(v) => (tab = v)}
    />
  </div>

  <div class="overflow-hidden rounded-2xl border-2 border-border bg-surface">
    {#if tab === "preview"}
      <div class="flex min-h-44 flex-wrap items-center gap-3 p-5 sm:p-6">
        <Preview />
      </div>
    {:else}
      <Code code={source.trim()} />
    {/if}
  </div>
</section>
