<script lang="ts">
  import { ActionSelect } from "kaizen-ui";

  let deck = $state("");
</script>

<div class="w-full max-w-sm">
  <ActionSelect
    bind:value={deck}
    options={["Kanji set 1", "Kanji set 2"]}
    label="Deck"
    empty="No deck"
    closeLabel="Close"
    actions={[
      { icon: "plus", label: "New deck", onclick: () => (deck = "Kanji set 3") },
      { icon: "trash", label: "Delete deck", disabled: deck === "", onclick: () => (deck = "") }
    ]}
  />
</div>
