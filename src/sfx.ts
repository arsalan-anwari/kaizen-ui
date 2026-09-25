// Short interface sounds, synthesised from oscillators.

import { shared } from "./shared";

let enabled = true;

type Step = [
  frequency: number,
  duration: number,
  type: OscillatorType,
  volume: number,
  delay: number
];

// How far ahead nodes are scheduled, so a ramp is not cut off mid block.
const LEAD_SECONDS = 0.02;

type Knock = [frequency: number, q: number, duration: number, volume: number, delay: number];

type Bus = { context: AudioContext; master: GainNode; noise: AudioBuffer };

const NOISE_SECONDS = 0.3;

function whiteNoise(context: AudioContext): AudioBuffer {
  const buffer = context.createBuffer(
    1,
    Math.ceil(context.sampleRate * NOISE_SECONDS),
    context.sampleRate
  );
  const samples = buffer.getChannelData(0);
  for (let index = 0; index < samples.length; index += 1) samples[index] = Math.random() * 2 - 1;
  return buffer;
}

function bus(): Bus | null {
  if (typeof window === "undefined") return null;
  return shared("kaizen-sfx-bus", () => {
    const context = new AudioContext({ latencyHint: "interactive" });
    const master = context.createGain();
    master.gain.value = 1;
    master.connect(context.destination);
    return { context, master, noise: whiteNoise(context) };
  });
}

function tone(target: Bus, step: Step, base: number): void {
  const [frequency, duration, type, volume, delay] = step;
  const start = base + delay;
  const oscillator = target.context.createOscillator();
  const gain = target.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(target.master);
  oscillator.onended = (): void => {
    oscillator.disconnect();
    gain.disconnect();
  };
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

// A tap on wood: a burst of noise narrowed to one resonance, dying out fast.
function knock(target: Bus, step: Knock, base: number): void {
  const [frequency, q, duration, volume, delay] = step;
  const start = base + delay;
  const source = target.context.createBufferSource();
  const filter = target.context.createBiquadFilter();
  const gain = target.context.createGain();
  source.buffer = target.noise;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(frequency, start);
  filter.Q.setValueAtTime(q, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  source.connect(filter).connect(gain).connect(target.master);
  source.onended = (): void => {
    source.disconnect();
    filter.disconnect();
    gain.disconnect();
  };
  source.start(start);
  source.stop(start + duration + 0.02);
}

type Voice = (target: Bus, base: number) => void;

function schedule(target: Bus, voice: Voice): void {
  voice(target, target.context.currentTime + LEAD_SECONDS);
}

function run(voice: Voice): void {
  if (!enabled) return;
  const target = bus();
  if (target === null) return;
  if (target.context.state === "running") {
    schedule(target, voice);
    return;
  }
  // a suspended context has a frozen clock, so schedule only after it resumes
  void target.context
    .resume()
    .then(() => schedule(target, voice))
    .catch(() => undefined);
}

function play(steps: Step[]): void {
  run((target, base) => {
    for (const step of steps) tone(target, step, base);
  });
}

function tap(knocks: Knock[]): void {
  run((target, base) => {
    for (const step of knocks) knock(target, step, base);
  });
}

// How long a block takes to drop into its slot, so the landing knock meets it.
export const BLOCK_DROP_SECONDS = 0.12;

const wood = {
  slot: (): void => tap([[1500, 9, 0.045, 1.6, 0]]),
  pick: (): void => tap([[1150, 7, 0.05, 2, 0]]),
  place: (): void =>
    tap([
      [720, 5, 0.09, 3, BLOCK_DROP_SECONDS],
      [260, 3, 0.07, 2.2, BLOCK_DROP_SECONDS]
    ]),
  lift: (): void =>
    tap([
      [1700, 9, 0.04, 1.6, 0],
      [1050, 7, 0.05, 1.4, 0.05]
    ]),
  done: (): void =>
    tap([
      [900, 7, 0.07, 2.2, BLOCK_DROP_SECONDS],
      [1200, 8, 0.07, 2.2, BLOCK_DROP_SECONDS + 0.08],
      [1600, 9, 0.09, 2.2, BLOCK_DROP_SECONDS + 0.16]
    ]),
  solved: (): void =>
    tap([
      [800, 6, 0.07, 2.4, BLOCK_DROP_SECONDS],
      [1000, 7, 0.07, 2.4, BLOCK_DROP_SECONDS + 0.09],
      [1300, 8, 0.07, 2.4, BLOCK_DROP_SECONDS + 0.18],
      [1750, 9, 0.16, 2.6, BLOCK_DROP_SECONDS + 0.3]
    ]),
  failed: (): void =>
    tap([
      [480, 4, 0.12, 3, BLOCK_DROP_SECONDS],
      [340, 4, 0.18, 3, BLOCK_DROP_SECONDS + 0.15]
    ])
};

export function setEffectsEnabled(value: boolean): void {
  enabled = value;
}

// Grades a finished run can land on, best first.
export const fanfareGrades = ["perfect", "great", "good", "fair", "poor"] as const;

export type FanfareGrade = (typeof fanfareGrades)[number];

const fanfares: Record<FanfareGrade, Step[]> = {
  // a full run up the scale, landing on a held major chord with a sparkle over it
  perfect: [
    [523, 0.11, "sine", 0.11, 0],
    [659, 0.11, "sine", 0.11, 0.09],
    [784, 0.11, "sine", 0.11, 0.18],
    [1047, 0.14, "sine", 0.12, 0.27],
    [784, 0.09, "sine", 0.08, 0.42],
    [1047, 0.09, "sine", 0.09, 0.49],
    [1319, 0.38, "sine", 0.12, 0.57],
    [1047, 0.5, "triangle", 0.07, 0.57],
    [1568, 0.5, "sine", 0.06, 0.6],
    [2093, 0.28, "sine", 0.05, 0.8],
    [2637, 0.22, "sine", 0.035, 0.94]
  ],
  // four notes up, held over a chord tone, no sparkle tail
  great: [
    [587, 0.11, "sine", 0.11, 0],
    [784, 0.11, "sine", 0.11, 0.1],
    [988, 0.13, "sine", 0.11, 0.2],
    [1175, 0.34, "sine", 0.11, 0.32],
    [784, 0.34, "triangle", 0.06, 0.32],
    [1568, 0.18, "sine", 0.04, 0.48]
  ],
  good: [
    [523, 0.13, "sine", 0.1, 0],
    [659, 0.13, "sine", 0.1, 0.12],
    [880, 0.26, "sine", 0.1, 0.24]
  ],
  fair: [
    [392, 0.14, "triangle", 0.09, 0],
    [440, 0.14, "triangle", 0.09, 0.13],
    [523, 0.3, "triangle", 0.08, 0.26]
  ],
  // a deflating slide down, over a low buzz
  poor: [
    [311, 0.17, "sawtooth", 0.075, 0],
    [294, 0.17, "sawtooth", 0.075, 0.15],
    [247, 0.19, "sawtooth", 0.075, 0.3],
    [185, 0.5, "sawtooth", 0.07, 0.48],
    [92, 0.5, "triangle", 0.05, 0.48]
  ]
};

export const sfx = {
  click: (): void => play([[420, 0.05, "triangle", 0.08, 0]]),
  select: (): void => play([[620, 0.06, "triangle", 0.08, 0]]),
  hint: (): void =>
    play([
      [740, 0.08, "sine", 0.09, 0],
      [988, 0.14, "sine", 0.08, 0.07]
    ]),
  correct: (): void =>
    play([
      [660, 0.1, "sine", 0.12, 0],
      [880, 0.16, "sine", 0.12, 0.08]
    ]),
  wrong: (): void =>
    play([
      [200, 0.16, "sawtooth", 0.07, 0],
      [150, 0.22, "sawtooth", 0.06, 0.09]
    ]),
  tick: (): void => play([[900, 0.03, "square", 0.03, 0]]),
  start: (): void =>
    play([
      [523, 0.1, "sine", 0.1, 0],
      [659, 0.1, "sine", 0.1, 0.09],
      [784, 0.18, "sine", 0.1, 0.18]
    ]),
  score: (grade: FanfareGrade): void => play(fanfares[grade]),
  wood
};

// The shared audio context, so an app can decode its own clips on the same bus.
export function audioContext(): AudioContext | null {
  return bus()?.context ?? null;
}
