<script lang="ts">
  import type { ChoiceState } from "../choice";
  import FitText from "./FitText.svelte";

  let {
    slot,
    label,
    jp = false,
    state = "idle",
    disabled = false,
    class: className = "",
    onpick
  }: {
    /** The keyboard slot this tile answers to, drawn in its corner. */
    slot: number;
    label: string;
    /** Renders the label through the Japanese face and tags it lang="ja". */
    jp?: boolean;
    state?: ChoiceState;
    disabled?: boolean;
    class?: string;
    onpick: () => void;
  } = $props();

  const tones: Record<ChoiceState, string> = {
    idle: "border-border bg-surface shadow-[0_4px_0_var(--color-border)] hover:border-selected hover:bg-accent active:translate-y-[4px] active:shadow-none",
    staged: "border-selected bg-selected-soft shadow-[0_4px_0_var(--color-selected)]",
    correct:
      "border-success/50 bg-success-soft text-success shadow-[0_4px_0_color-mix(in_srgb,var(--success)_35%,transparent)]",
    wrong:
      "border-danger/50 bg-danger-soft text-danger shadow-[0_4px_0_color-mix(in_srgb,var(--danger)_35%,transparent)] anim-shake",
    dimmed: "border-border bg-surface opacity-40"
  };
</script>

<button
  type="button"
  {disabled}
  class="@container relative flex aspect-[3/2] w-full cursor-pointer items-center justify-center rounded-2xl border-2 transition-[transform,background-color,border-color,color] duration-100 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:cursor-default {tones[
    state
  ]} {className}"
  onclick={onpick}
>
  <span
    class="absolute top-2 left-3 text-xs font-bold text-muted-foreground sm:top-3 sm:left-4"
    aria-hidden="true"
  >
    {slot}
  </span>
  <!-- A long answer shrinks rather than wrapping: a second line would run under
       the slot number in the corner. -->
  <FitText
    text={label}
    cap={jp ? 34 : 30}
    em={jp ? 1 : 0.55}
    lang={jp ? "ja" : undefined}
    class="font-bold {jp ? 'jp' : ''}"
  />
</button>
