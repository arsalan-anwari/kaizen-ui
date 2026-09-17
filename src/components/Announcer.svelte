<script lang="ts">
  let {
    message = "",
    assertive = false
  }: {
    message?: string;
    assertive?: boolean;
  } = $props();

  let text = $state("");

  $effect(() => {
    const next = message;
    text = "";
    if (next === "") return;
    const timer = setTimeout(() => (text = next), 60);
    return () => clearTimeout(timer);
  });
</script>

<span
  class="sr-only"
  role={assertive ? "alert" : "status"}
  aria-live={assertive ? "assertive" : "polite"}
  aria-atomic="true">{text}</span
>
