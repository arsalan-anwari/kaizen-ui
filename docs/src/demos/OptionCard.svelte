<script lang="ts">
  import { OptionCard } from "kaizen-ui";

  const options: [string, string][] = [
    ["daily", "10 minutes a day"],
    ["weekly", "One long session"],
    ["free", "No goal"]
  ];
  let picked = $state("daily");
</script>

<div class="grid w-full gap-3 sm:grid-cols-3">
  {#each options as [value, hint] (value)}
    <OptionCard label={value} {hint} active={picked === value} onclick={() => (picked = value)} />
  {/each}
</div>
