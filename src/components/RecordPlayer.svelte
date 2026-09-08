<script lang="ts">
  let {
    peaks = [],
    progress = 0,
    playing = false,
    compact = false,
    label,
    onplay
  }: {
    peaks?: number[];
    progress?: number;
    playing?: boolean;
    compact?: boolean;
    label: string;
    onplay?: () => void;
  } = $props();

  const wide = { w: 200, h: 200, cx: 100, cy: 84, r: 60, px: 40, py: 168, pr: 19, wx: 68, ww: 112, wy: 168, wh: 34 };
  const slim = { w: 230, h: 100, cx: 50, cy: 50, r: 40, px: 112, py: 50, pr: 16, wx: 140, ww: 76, wy: 50, wh: 48 };

  const L = $derived(compact ? slim : wide);

  const grooves = $derived([0.86, 0.72, 0.58, 0.44].map((step) => L.r * step));
  const bars = $derived(peaks.length > 0 ? peaks : Array.from({ length: 24 }, () => 0.25));
</script>

<button
  type="button"
  class="record-player h-full w-full cursor-pointer rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  aria-label={label}
  onclick={onplay}
>
  <svg viewBox="0 0 {L.w} {L.h}" class="h-full w-full" role="presentation">
    <defs>
      <linearGradient id="kz-case" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stop-color="#f2f4f3" />
        <stop offset="18%" stop-color="#c9cec9" />
        <stop offset="42%" stop-color="#eef0ee" />
        <stop offset="62%" stop-color="#a7aeaa" />
        <stop offset="100%" stop-color="#cfd4d0" />
      </linearGradient>
      <linearGradient id="kz-rim" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#fbfcfb" />
        <stop offset="50%" stop-color="#8e9691" />
        <stop offset="100%" stop-color="#e6e9e6" />
      </linearGradient>
      <radialGradient id="kz-vinyl" cx="0.38" cy="0.32" r="0.85">
        <stop offset="0%" stop-color="#3d4340" />
        <stop offset="55%" stop-color="#1b1f1d" />
        <stop offset="100%" stop-color="#0d100f" />
      </radialGradient>
      <linearGradient id="kz-sheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5" />
        <stop offset="45%" stop-color="#ffffff" stop-opacity="0" />
        <stop offset="100%" stop-color="#ffffff" stop-opacity="0.22" />
      </linearGradient>
    </defs>

    <rect x="2" y="2" width={L.w - 4} height={L.h - 4} rx="14" fill="url(#kz-case)" stroke="#7c847f" stroke-width="2" />
    <rect x="7" y="7" width={L.w - 14} height={L.h - 14} rx="10" fill="none" stroke="#ffffff" stroke-opacity="0.55" />

    {#each [[14, 14], [L.w - 14, 14], [14, L.h - 14], [L.w - 14, L.h - 14]] as [x, y] (`${x}-${y}`)}
      <g>
        <circle cx={x} cy={y} r="3.6" fill="#9aa19c" stroke="#6f7772" />
        <path d="M{x - 2} {y} h4" stroke="#5f6763" stroke-width="1" />
      </g>
    {/each}

    <circle cx={L.cx} cy={L.cy} r={L.r + 6} fill="url(#kz-rim)" stroke="#767e79" stroke-width="1.5" />

    <g
      class:record-spin={playing}
      style="transform-box: view-box; transform-origin: {L.cx}px {L.cy}px"
    >
      <circle cx={L.cx} cy={L.cy} r={L.r} fill="url(#kz-vinyl)" />
      {#each grooves as groove (groove)}
        <circle cx={L.cx} cy={L.cy} r={groove} fill="none" stroke="#ffffff" stroke-opacity="0.09" />
      {/each}
      <circle cx={L.cx} cy={L.cy} r={L.r * 0.3} fill="#b8442f" />
      <circle cx={L.cx} cy={L.cy} r={L.r * 0.3} fill="none" stroke="#7d2c1e" />
      <path
        d="M{L.cx} {L.cy - L.r * 0.3} a{L.r * 0.3} {L.r * 0.3} 0 0 1 {L.r * 0.3} {L.r * 0.3}"
        fill="none"
        stroke="#ffffff"
        stroke-opacity="0.35"
        stroke-width="2"
      />
      <circle cx={L.cx} cy={L.cy} r="2.6" fill="#e7eae7" />
    </g>

    <circle cx={L.cx} cy={L.cy} r={L.r} fill="url(#kz-sheen)" pointer-events="none" />

    <g
      class="record-arm"
      style="transform-box: view-box; transform-origin: {L.cx + L.r + 2}px {L.cy - L.r * 0.72}px"
      transform="rotate({playing ? 16 : 0})"
    >
      <line
        x1={L.cx + L.r + 2}
        y1={L.cy - L.r * 0.72}
        x2={L.cx + L.r * 0.52}
        y2={L.cy - L.r * 0.34}
        stroke="#9ba29d"
        stroke-width="4"
        stroke-linecap="round"
      />
      <rect
        x={L.cx + L.r * 0.44}
        y={L.cy - L.r * 0.42}
        width="11"
        height="8"
        rx="2"
        fill="#6f7772"
        transform="rotate(32 {L.cx + L.r * 0.5} {L.cy - L.r * 0.38})"
      />
      <circle cx={L.cx + L.r + 2} cy={L.cy - L.r * 0.72} r="7" fill="url(#kz-rim)" stroke="#767e79" />
    </g>

    <g class="record-button">
      <circle cx={L.px} cy={L.py} r={L.pr} fill="url(#kz-rim)" stroke="#6f7772" stroke-width="1.5" />
      <circle cx={L.px} cy={L.py} r={L.pr - 4} fill="#4d5450" />
      {#if playing}
        <path
          d="M{L.px - 5} {L.py - 6} h3.5 v12 h-3.5 z M{L.px + 1.5} {L.py - 6} h3.5 v12 h-3.5 z"
          fill="#eef0ee"
        />
      {:else}
        <path d="M{L.px - 4} {L.py - 6.5} l11 6.5 l-11 6.5 z" fill="#eef0ee" />
      {/if}
    </g>

    <rect x={L.wx - 6} y={L.wy - L.wh / 2 - 4} width={L.ww + 12} height={L.wh + 8} rx="6" fill="#3f4642" stroke="#767e79" />
    {#each bars as peak, index (index)}
      {@const step = L.ww / bars.length}
      {@const height = Math.max(2, peak * L.wh)}
      <rect
        x={L.wx + index * step}
        y={L.wy - height / 2}
        width={Math.max(1, step - 1.4)}
        height={height}
        rx="0.8"
        fill={index / bars.length < progress ? "#8fd67f" : "#8f9995"}
      />
    {/each}
  </svg>
</button>
