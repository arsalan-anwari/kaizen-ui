<script lang="ts">
  import { Button } from "kaizen-ui";
</script>

<Button>Primary</Button>
<Button variant="brand">Brand</Button>
<Button variant="seal">Seal</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra</Button>
<Button disabled>Disabled</Button>
<!-- `wrap` drops the fixed height for a floor and lets the label break, so a
     long translated label stays inside the button instead of spilling out. -->
<div class="w-40">
  <Button wrap>A label long enough to wrap onto two lines</Button>
</div>
