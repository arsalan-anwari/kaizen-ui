<script lang="ts">
  import IconButton from "./IconButton.svelte";
  import { i18n } from "../i18n.svelte";
  import { sfx } from "../sfx";

  /* Month grid over "YYYY-MM-DD" keys, in local time. Replaces <input
     type="date">, whose popup is drawn by the OS and ignores the theme.
     Month, weekday and week start come from Intl, so it needs no strings. */

  let {
    value = $bindable(""),
    min = "",
    max = "",
    onpick
  }: {
    value?: string;
    /** Earliest selectable day, "YYYY-MM-DD". Empty means no bound. */
    min?: string;
    max?: string;
    onpick?: (value: string) => void;
  } = $props();

  function parse(key: string): Date | null {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
    return parts === null
      ? null
      : new Date(Number(parts[1]), Number(parts[2]) - 1, Number(parts[3]));
  }

  function dayKey(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
  }

  function firstOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  let cursor = $state(firstOfMonth(parse(value) ?? new Date()));

  // Follow the value when the page sets it, e.g. a range picker swapping ends.
  $effect(() => {
    const picked = parse(value);
    if (picked !== null) cursor = firstOfMonth(picked);
  });

  const today = dayKey(new Date());

  // 1 = Monday .. 7 = Sunday. Older webviews have no getWeekInfo; assume Monday.
  const weekStart = $derived(
    (new Intl.Locale(i18n.locale) as Intl.Locale & { getWeekInfo?: () => { firstDay: number } })
      .getWeekInfo?.().firstDay ?? 1
  );

  const weekdays = $derived.by(() => {
    const format = new Intl.DateTimeFormat(i18n.locale, { weekday: "narrow" });
    // 1 January 2024 was a Monday.
    return Array.from({ length: 7 }, (_, index) =>
      format.format(new Date(2024, 0, 1 + ((weekStart - 1 + index) % 7)))
    );
  });

  const days = $derived.by(() => {
    const lead = (cursor.getDay() - (weekStart % 7) + 7) % 7;
    const count = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from(
        { length: count },
        (_, index) => new Date(cursor.getFullYear(), cursor.getMonth(), index + 1)
      )
    ];
  });

  const prev = $derived(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const next = $derived(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));

  // The previous month is reachable while its last day is still in range.
  const canPrev = $derived(
    min === "" || dayKey(new Date(cursor.getFullYear(), cursor.getMonth(), 0)) >= min
  );
  const canNext = $derived(max === "" || dayKey(next) <= max);

  function monthName(date: Date): string {
    return new Intl.DateTimeFormat(i18n.locale, { month: "long", year: "numeric" }).format(date);
  }

  function blocked(day: Date): boolean {
    const key = dayKey(day);
    return (min !== "" && key < min) || (max !== "" && key > max);
  }

  function pick(day: Date): void {
    sfx.select();
    value = dayKey(day);
    onpick?.(value);
  }
</script>

<div class="flex flex-col gap-2">
  <div class="flex items-center justify-between gap-2">
    <IconButton
      size="sm"
      variant="ghost"
      icon="chevron-left"
      label={monthName(prev)}
      disabled={!canPrev}
      onclick={() => (cursor = prev)}
    />
    <span class="text-sm font-bold">{monthName(cursor)}</span>
    <IconButton
      size="sm"
      variant="ghost"
      icon="chevron-right"
      label={monthName(next)}
      disabled={!canNext}
      onclick={() => (cursor = next)}
    />
  </div>

  <div class="grid grid-cols-7 gap-1 text-center">
    {#each weekdays as name, index (index)}
      <span class="text-[0.625rem] font-bold uppercase text-muted-foreground">{name}</span>
    {/each}

    {#each days as day, index (index)}
      {#if day === null}
        <span></span>
      {:else}
        <button
          type="button"
          disabled={blocked(day)}
          aria-pressed={dayKey(day) === value}
          class="flex h-9 cursor-pointer items-center justify-center rounded-lg text-sm tabular-nums transition-colors disabled:cursor-not-allowed disabled:opacity-25 {dayKey(
            day
          ) === value
            ? 'bg-selected font-bold text-background'
            : dayKey(day) === today
              ? 'border border-wire font-bold hover:bg-accent'
              : 'hover:bg-accent'}"
          onclick={() => pick(day)}
        >
          {day.getDate()}
        </button>
      {/if}
    {/each}
  </div>
</div>
