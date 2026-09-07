<script lang="ts">

  let {
    value = 0,
    tone = "brand",
    size = "md",
    class: className = "",
    label = ""
  }: {
    value?: number;
    tone?: "brand" | "primary" | "danger" | "success" | "seal";
    size?: "sm" | "md" | "lg";
    class?: string;
    label?: string;
  } = $props();

  const tones = {
    brand: "bg-brand",
    primary: "bg-primary",
    danger: "bg-danger",
    success: "bg-success",
    seal: "bg-seal"
  };

  const sizes = { sm: "h-1.5", md: "h-3", lg: "h-4" };

  const share = $derived(Math.max(0, Math.min(1, value)));
</script>

<div
  class="w-full overflow-hidden rounded-full bg-secondary inset-shadow-sm {sizes[size]} {className}"
  role="progressbar"
  aria-label={label === "" ? undefined : label}
  aria-valuenow={Math.round(share * 100)}
  aria-valuemin={0}
  aria-valuemax={100}
>
  <div
    class="h-full rounded-full transition-[width] duration-500 ease-out {tones[tone]}"
    style="width: {share * 100}%"
  ></div>
</div>
