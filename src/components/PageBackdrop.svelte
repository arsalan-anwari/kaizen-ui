<script lang="ts">

  import classroom from "../assets/classroom.svg";

  let { class: className = "" }: { class?: string } = $props();
</script>

<div
  class="backdrop pointer-events-none fixed inset-0 z-0 bg-cover bg-bottom bg-no-repeat opacity-(--backdrop-fade) {className}"
  style="background-image: url({classroom}); filter: var(--backdrop-filter)"
  aria-hidden="true"
></div>
