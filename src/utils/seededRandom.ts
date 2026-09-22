import {random} from 'remotion';

/**
 * Deterministic pseudo-random number in [0, 1).
 * Same seed always gives the same value — required so every
 * render (local, CI, re-render) produces an identical video.
 */
export function seededRandom(seed: string | number): number {
	return random(seed);
}

export function seededRange(seed: string | number, min: number, max: number): number {
	return min + seededRandom(seed) * (max - min);
}
