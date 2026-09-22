import React from 'react';
import {AbsoluteFill, interpolateColors, useCurrentFrame, useVideoConfig} from 'remotion';
import {AUDIO_DATA, bassAt, segmentIndexAt} from '../utils/audioMath';

// One mood color per structural segment (5 segments from structure_boundaries).
// Deep teal/black dominates the "list of no's" tension; warm amber arrives
// with "instead we have idiots"; a bright flash closes on "Woohoo!".
const SEGMENT_COLORS = [
	'#05080a', // 0: "What a boring planet." — near-black, empty
	'#071a1f', // 1: brief transitional beat
	'#0a2630', // 2: the "no dragons... no dwarves" list — deep teal tension
	'#241408', // 3: "Instead we have idiots into hexes." — warm shift
	'#3a1c08', // 4: "Woohoo!" — bright warm flash
];

export const BackgroundMood: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const segIdx = segmentIndexAt(t);
	const nextIdx = Math.min(segIdx + 1, SEGMENT_COLORS.length - 1);
	const boundaries = AUDIO_DATA.structure_boundaries;
	const segStart = boundaries[segIdx];
	const segEnd = boundaries[Math.min(segIdx + 1, boundaries.length - 1)];

	// Crossfade the last 0.35s of each segment into the next mood color.
	const crossfadeWindow = 0.35;
	const timeIntoFade = t - (segEnd - crossfadeWindow);
	const fadeProgress = segEnd > segStart ? Math.max(0, Math.min(1, timeIntoFade / crossfadeWindow)) : 0;

	const baseColor = interpolateColors(
		fadeProgress,
		[0, 1],
		[SEGMENT_COLORS[segIdx], SEGMENT_COLORS[nextIdx]]
	);

	// Bass gives the vignette a subtle "breathing" brightness.
	const bass = bassAt(t);
	const glow = Math.min(0.35, bass * 0.18);

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(circle at 50% 42%, rgba(255,180,120,${glow}) 0%, ${baseColor} 55%, #000000 100%)`,
			}}
		/>
	);
};
