import React from 'react';
import {AbsoluteFill} from 'remotion';

// Static, very subtle texture — no per-frame reseed. Apple's motion
// philosophy avoids flicker/shake with no purpose; grain should be felt,
// not seen moving.
export const GrainOverlay: React.FC = () => {
	return (
		<AbsoluteFill style={{mixBlendMode: 'overlay', opacity: 0.035, pointerEvents: 'none'}}>
			<svg width="100%" height="100%">
				<filter id="grainFilter">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={7} stitchTiles="stitch" />
					<feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grainFilter)" />
			</svg>
		</AbsoluteFill>
	);
};
