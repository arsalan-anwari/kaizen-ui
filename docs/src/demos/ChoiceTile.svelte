<script lang="ts">
  import { ChoiceTile, type ChoiceState } from "kaizen-ui";

  const answers = ["a", "i", "u", "e"];
  const correct = "u";

  let picked = $state<string | null>(null);

  function stateOf(answer: string): ChoiceState {
    if (picked === null) return "idle";
    if (answer === correct) return "correct";
    if (answer === picked) return "wrong";
    return "dimmed";
  }
</script>

<div class="flex w-full flex-col gap-3">
  <p class="text-h2 jp font-bold" lang="ja">う</p>

  <div class="grid w-full max-w-md grid-cols-2 gap-3">
    {#each answers as answer, index (answer)}
      <ChoiceTile
        slot={index + 1}
        label={answer}
        state={stateOf(answer)}
        disabled={picked !== null}
        onpick={() => (picked = answer)}
      />
    {/each}
  </div>

  <p class="text-sm text-foreground/75">
    The corner number is the key that answers it. Pick one and the rest dim, the right one turns
    green and a wrong one shakes.
  </p>
</div>
