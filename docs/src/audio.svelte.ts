import { audioContext } from "kaizen-ui";

export const clips = ["a", "ka", "shi", "tsu", "n"] as const;
export const kana: Record<string, string> = { a: "あ", ka: "か", shi: "し", tsu: "つ", n: "ん" };

const flat = Array.from({ length: 48 }, () => 0.12);
const buffers = new Map<string, AudioBuffer>();

export const player = $state({
  clip: "a",
  peaks: flat as number[],
  progress: 0,
  playing: false
});

let source: AudioBufferSourceNode | null = null;
let started = false;

function peaksOf(buffer: AudioBuffer, count = 48): number[] {
  const data = buffer.getChannelData(0);
  const step = Math.max(1, Math.floor(data.length / count));
  return Array.from({ length: count }, (_, bucket) => {
    let peak = 0;
    const end = Math.min(data.length, (bucket + 1) * step);
    for (let i = bucket * step; i < end; i += 1) peak = Math.max(peak, Math.abs(data[i]));
    return Math.min(1, peak * 1.4);
  });
}

async function load(name: string): Promise<AudioBuffer | null> {
  const context = audioContext();
  if (context === null) return null;
  const cached = buffers.get(name);
  if (cached !== undefined) return cached;
  const bytes = await fetch(`${import.meta.env.BASE_URL}audio/${name}.mp3`).then((r) =>
    r.arrayBuffer()
  );
  const buffer = await context.decodeAudioData(bytes);
  buffers.set(name, buffer);
  return buffer;
}

/** Pick the clip both demos draw and play. */
export function pick(name: string): void {
  player.clip = name;
  player.progress = 0;
  void load(name).then((buffer) => {
    if (player.clip === name) player.peaks = buffer === null ? flat : peaksOf(buffer);
  });
}

/** Decode the first clip once, on mount rather than at import. */
export function start(): void {
  if (started) return;
  started = true;
  pick(player.clip);
}

export async function play(): Promise<void> {
  const context = audioContext();
  const buffer = await load(player.clip);
  if (context === null || buffer === null) return;
  source?.stop();
  if (context.state !== "running") await context.resume();
  source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(context.destination);
  const startedAt = context.currentTime;
  source.onended = () => {
    player.playing = false;
    player.progress = 0;
  };
  source.start();
  player.playing = true;
  const tick = (): void => {
    if (!player.playing) return;
    player.progress = Math.min(1, (context.currentTime - startedAt) / buffer.duration);
    requestAnimationFrame(tick);
  };
  tick();
}
