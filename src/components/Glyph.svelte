<script lang="ts">
  let {
    text,
    label = "",
    lang = "ja",
    class: className = "",
    style = ""
  }: {
    text: string;
    label?: string;
    lang?: string;
    class?: string;
    style?: string;
  } = $props();
</script>

<span
  class="jp {className}"
  {lang}
  {style}
  role={label === "" ? undefined : "img"}
  aria-label={label === "" ? undefined : label}>{text}</span
>
