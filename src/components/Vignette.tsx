import React from 'react';
import {AbsoluteFill} from 'remotion';

export const Vignette: React.FC = () => (
	<AbsoluteFill
		style={{
			pointerEvents: 'none',
			background: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)',
		}}
	/>
);
