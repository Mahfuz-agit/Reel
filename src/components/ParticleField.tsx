import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {seededRandom, seededRange} from '../utils/seededRandom';

type Props = {
	count?: number;
	depth: 'back' | 'front';
};

export const ParticleField: React.FC<Props> = ({count = 22, depth}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;

	const isBack = depth === 'back';
	const speed = isBack ? 14 : 34; // px/sec drifting upward
	const blur = isBack ? 6 : 2;
	const baseOpacity = isBack ? 0.18 : 0.32;
	const sizeRange: [number, number] = isBack ? [2, 5] : [4, 9];

	const particles = new Array(count).fill(0).map((_, i) => {
		const seed = `${depth}-${i}`;
		const x = seededRange(`${seed}-x`, 0, width);
		const startY = seededRange(`${seed}-y`, 0, height);
		const size = seededRange(`${seed}-s`, sizeRange[0], sizeRange[1]);
		const drift = seededRange(`${seed}-d`, -8, 8);
		const twinkleOffset = seededRandom(`${seed}-t`) * Math.PI * 2;

		// Wrap vertically so particles loop as they drift off-screen.
		const y = ((startY - t * speed) % (height + 40) + (height + 40)) % (height + 40) - 20;
		const twinkle = 0.6 + 0.4 * Math.sin(t * 1.4 + twinkleOffset);

		return {x: x + Math.sin(t * 0.5 + twinkleOffset) * drift, y, size, twinkle};
	});

	return (
		<AbsoluteFill>
			{particles.map((p, i) => (
				<div
					key={i}
					style={{
						position: 'absolute',
						left: p.x,
						top: p.y,
						width: p.size,
						height: p.size,
						borderRadius: '50%',
						background: isBack ? '#12b8c4' : '#ff9a5c',
						opacity: baseOpacity * p.twinkle,
						filter: `blur(${blur}px)`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
