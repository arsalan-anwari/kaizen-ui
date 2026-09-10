<script lang="ts">
  import { RowBar } from "kaizen-ui";

  let open = $state(false);
</script>

<div class="w-full max-w-md">
  <RowBar label="Reading drill" hint="20 cards" bind:open active={open}>
    <p class="px-4 pb-3 text-sm text-foreground/75">Expanded content lives here.</p>
  </RowBar>
</div>
