import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {AUDIO_DATA} from '../utils/audioMath';

// A soft warm streak that sweeps across the frame right as each structural
// segment changes — reinforces the cut without a hard jump.
export const LightLeakSweep: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const t = frame / fps;

	const boundaries = AUDIO_DATA.structure_boundaries.slice(1, -1); // ignore start/end
	const sweepDuration = 0.5;

	let bestOpacity = 0;
	let bestX = -9999;

	for (const b of boundaries) {
		const local = t - b;
		if (local >= -0.1 && local <= sweepDuration) {
			const progress = Math.max(0, Math.min(1, (local + 0.1) / (sweepDuration + 0.1)));
			const opacity = interpolate(progress, [0, 0.3, 1], [0, 0.5, 0]);
			const x = interpolate(progress, [0, 1], [-width * 0.3, width * 1.3]);
			if (opacity > bestOpacity) {
				bestOpacity = opacity;
				bestX = x;
			}
		}
	}

	if (bestOpacity <= 0) return null;

	return (
		<AbsoluteFill style={{pointerEvents: 'none', mixBlendMode: 'screen'}}>
			<div
				style={{
					position: 'absolute',
					top: '-10%',
					left: bestX,
					width: 260,
					height: '120%',
					background:
						'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(255,210,160,0.9) 45%, rgba(255,255,255,0) 100%)',
					opacity: bestOpacity,
					filter: 'blur(30px)',
					transform: 'rotate(8deg)',
				}}
			/>
		</AbsoluteFill>
	);
};
