<script lang="ts">
  import { Card, PageBackdrop } from "kaizen-ui";
</script>

<!-- PageBackdrop is `fixed inset-0`, so it normally covers the window. Forcing
     it to `absolute` pins it to the tile instead. -->
<div class="grid w-full gap-4 sm:grid-cols-2">
  <figure class="flex flex-col gap-2">
    <div class="relative h-52 overflow-hidden rounded-xl border-2 border-border bg-background">
      <PageBackdrop class="absolute!" />
      <div class="relative z-10 grid h-full place-items-center p-4">
        <Card title="Today" description="Cards due before midnight">
          <p class="text-sm text-foreground/75">Content sits above it on z-10.</p>
        </Card>
      </div>
    </div>
    <figcaption class="text-xs text-foreground/75">
      As it renders: faded to <code>--backdrop-fade</code>, behind everything.
    </figcaption>
  </figure>

  <figure class="flex flex-col gap-2">
    <div class="relative h-52 overflow-hidden rounded-xl border-2 border-border bg-background">
      <PageBackdrop class="absolute! opacity-100!" />
    </div>
    <figcaption class="text-xs text-foreground/75">
      The same layer at full opacity, so you can see the artwork.
    </figcaption>
  </figure>
</div>
