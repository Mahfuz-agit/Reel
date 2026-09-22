import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {seededRange} from '../utils/seededRandom';

type Props = {
	count?: number;
	depth: 'back' | 'front';
};

export const ParticleField: React.FC<Props> = ({count = 22, depth}) => {
	const frame = useCurrentFrame();
	const {fps, width, height} = useVideoConfig();
	const t = frame / fps;

	const isBack = depth === 'back';
	const speed = isBack ? 10 : 20; // px/sec, slow and steady — no jitter
	const blur = isBack ? 8 : 3;
	const baseOpacity = isBack ? 0.1 : 0.16;
	const sizeRange: [number, number] = isBack ? [2, 4] : [3, 6];

	const particles = new Array(count).fill(0).map((_, i) => {
		const seed = `${depth}-${i}`;
		const x = seededRange(`${seed}-x`, 0, width);
		const startY = seededRange(`${seed}-y`, 0, height);
		const size = seededRange(`${seed}-s`, sizeRange[0], sizeRange[1]);

		// Wrap vertically so particles loop as they drift off-screen.
		const y = ((startY - t * speed) % (height + 40) + (height + 40)) % (height + 40) - 20;

		return {x, y, size};
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
						opacity: baseOpacity,
						filter: `blur(${blur}px)`,
					}}
				/>
			))}
		</AbsoluteFill>
	);
};
