import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {beatPulseAt} from '../utils/audioMath';

export const GlowPulse: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const t = frame / fps;

	const pulse = beatPulseAt(t); // 0..1, spikes on every detected beat
	const scale = 1 + pulse * 0.35;
	const opacity = 0.12 + pulse * 0.28;

	return (
		<AbsoluteFill style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
			<div
				style={{
					width: 900,
					height: 900,
					borderRadius: '50%',
					transform: `scale(${scale})`,
					background:
						'radial-gradient(circle, rgba(255,140,70,0.9) 0%, rgba(18,184,196,0.35) 45%, rgba(0,0,0,0) 70%)',
					opacity,
					filter: 'blur(18px)',
				}}
			/>
		</AbsoluteFill>
	);
};
