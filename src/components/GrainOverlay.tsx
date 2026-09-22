import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

export const GrainOverlay: React.FC = () => {
	const frame = useCurrentFrame();
	// Re-seed the turbulence every few frames so grain flickers like real film,
	// instead of scrolling smoothly (which looks synthetic).
	const seed = Math.floor(frame / 2) % 100;

	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.08, pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grainFilter">
					<feTurbulence
						type="fractalNoise"
						baseFrequency="0.85"
						numOctaves={2}
						seed={seed}
						stitchTiles="stitch"
					/>
					<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grainFilter)" />
			</svg>
		</AbsoluteFill>
	);
};
