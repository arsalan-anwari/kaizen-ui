<script lang="ts">

  type Tone = "idle" | "correct" | "wrong";

  let {
    value = $bindable(""),
    placeholder = "",
    disabled = false,
    big = false,
    focusOnMount = false,
    tone = "idle",
    onenter
  }: {
    value?: string;
    placeholder?: string;
    disabled?: boolean;
    big?: boolean;
    focusOnMount?: boolean;
    tone?: Tone;
    onenter?: () => void;
  } = $props();

  let element = $state<HTMLInputElement | null>(null);

  $effect(() => {
    if (focusOnMount && element !== null && !disabled) element.focus();
  });

  const tones: Record<Tone, string> = {
    idle: "border-wire bg-surface focus-visible:border-selected disabled:opacity-50",
    correct: "border-success/50 bg-success-soft text-success",
    wrong: "border-danger/50 bg-danger-soft text-danger anim-shake"
  };

  function keydown(event: KeyboardEvent): void {
    if (event.key === "Enter") {
      event.preventDefault();
      onenter?.();
    }
  }
</script>

<input
  type="text"
  bind:this={element}
  bind:value
  {placeholder}
  {disabled}
  autocomplete="off"
  autocapitalize="off"
  autocorrect="off"
  spellcheck="false"
  onkeydown={keydown}
  class="w-full rounded-2xl border-2 text-center font-bold transition-colors placeholder:font-normal placeholder:text-muted-foreground focus-visible:outline-none {tones[
    tone
  ]} {big ? 'py-3 text-h2 sm:py-5' : 'px-4 py-3 text-base'}"
/>
