import audioData from '../data/audioData.json';

export type TranscriptWord = {word: string; start: number; end: number};
export type EnergyPoint = {time: number; energy: number};
export type SpectralPoint = {time: number; bass: number; mid: number; treble: number};
export type SilenceGap = {start: number; end: number};

export const AUDIO_DATA = audioData as {
	transcript: TranscriptWord[];
	rhythm: {bpm: number; beat_times: number[]; onset_times: number[]};
	energy: EnergyPoint[];
	pitch: {time: number; hz: number | null}[];
	spectral_bands: SpectralPoint[];
	silence: SilenceGap[];
	key: string;
	structure_boundaries: number[];
};

// Binary search: index of the last point whose `time` is <= t.
function floorIndexByTime<T extends {time: number}>(arr: T[], t: number): number {
	let lo = 0;
	let hi = arr.length - 1;
	if (t <= arr[0].time) return 0;
	if (t >= arr[hi].time) return hi;
	while (lo < hi) {
		const mid = (lo + hi + 1) >> 1;
		if (arr[mid].time <= t) lo = mid;
		else hi = mid - 1;
	}
	return lo;
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function interpolateSeries<T extends {time: number}>(
	arr: T[],
	t: number,
	pick: (p: T) => number
): number {
	const i = floorIndexByTime(arr, t);
	const a = arr[i];
	const b = arr[Math.min(i + 1, arr.length - 1)];
	if (a.time === b.time) return pick(a);
	const localT = (t - a.time) / (b.time - a.time);
	return lerp(pick(a), pick(b), Math.max(0, Math.min(1, localT)));
}

/** Overall waveform energy (0..~1) at a given time in seconds. */
export function energyAt(t: number): number {
	return interpolateSeries(AUDIO_DATA.energy, t, (p) => p.energy);
}

/** Low-frequency (bass) intensity at a given time in seconds. */
export function bassAt(t: number): number {
	return interpolateSeries(AUDIO_DATA.spectral_bands, t, (p) => p.bass);
}

export function midAt(t: number): number {
	return interpolateSeries(AUDIO_DATA.spectral_bands, t, (p) => p.mid);
}

export function trebleAt(t: number): number {
	return interpolateSeries(AUDIO_DATA.spectral_bands, t, (p) => p.treble);
}

/** 0..1 pulse amplitude: 1 right on a beat, decaying to 0 over `decaySeconds`. */
export function beatPulseAt(t: number, decaySeconds = 0.22): number {
	const beats = AUDIO_DATA.rhythm.beat_times;
	let best = Infinity;
	for (let i = 0; i < beats.length; i++) {
		const delta = t - beats[i];
		if (delta >= 0 && delta < best) best = delta;
		if (beats[i] > t) break;
	}
	if (!isFinite(best) || best >= decaySeconds) return 0;
	const x = 1 - best / decaySeconds;
	// ease-out cubic
	return 1 - Math.pow(1 - x, 3);
}

/** True if `t` falls inside one of the detected silence gaps. */
export function isSilentAt(t: number): boolean {
	return AUDIO_DATA.silence.some((s) => t >= s.start && t <= s.end);
}

/** Index (0-based) of the structural segment containing time `t`. */
export function segmentIndexAt(t: number): number {
	const b = AUDIO_DATA.structure_boundaries;
	for (let i = b.length - 1; i >= 0; i--) {
		if (t >= b[i]) return Math.min(i, b.length - 2);
	}
	return 0;
}

/** How far (0..1) we are through the current segment. */
export function segmentProgressAt(t: number): number {
	const b = AUDIO_DATA.structure_boundaries;
	const i = segmentIndexAt(t);
	const start = b[i];
	const end = b[Math.min(i + 1, b.length - 1)];
	if (end <= start) return 1;
	return Math.max(0, Math.min(1, (t - start) / (end - start)));
}

export function secondsToFrames(seconds: number, fps: number): number {
	return Math.round(seconds * fps);
}

/** Total audio duration in seconds, inferred from the last known data point. */
export function totalAudioDuration(): number {
	const lastEnergy = AUDIO_DATA.energy[AUDIO_DATA.energy.length - 1]?.time ?? 0;
	const lastWord = AUDIO_DATA.transcript[AUDIO_DATA.transcript.length - 1]?.end ?? 0;
	return Math.max(lastEnergy, lastWord);
}
