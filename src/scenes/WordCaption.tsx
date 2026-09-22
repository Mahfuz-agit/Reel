import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {
	word: string;
	startFrame: number; // frame this word's speech begins
	endFrame: number; // frame this word's speech ends
	/** Punchy "no X" list items and the finale get the harder entrance. */
	emphasis: boolean;
};

// Apple's kinetic type never carries loose commas/periods on screen —
// punctuation is a reading-speed cue for prose, not part of a display word.
// Keep "!" since it's expressive (Woohoo!), drop everything else.
const cleanForDisplay = (word: string) => word.replace(/[.,]/g, '');

const FONT_STACK =
	"-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif";

export const WordCaption: React.FC<Props> = ({word, startFrame, endFrame, emphasis}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	const localFrame = frame - startFrame;
	const holdFrames = endFrame - startFrame + Math.round(fps * 0.18); // small linger
	const exitStart = holdFrames - Math.round(fps * 0.1);

	if (localFrame < 0 || localFrame > holdFrames) return null;

	const entrance = spring({
		frame: localFrame,
		fps,
		config: emphasis
			? {damping: 11, stiffness: 220, mass: 0.6} // sharp punch-in
			: {damping: 18, stiffness: 90, mass: 0.8}, // soft, calm reveal
	});

	const exitProgress = interpolate(localFrame, [exitStart, holdFrames], [1, 0], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
	});

	const scale = emphasis ? interpolate(entrance, [0, 1], [0.4, 1]) : interpolate(entrance, [0, 1], [0.94, 1]);
	const translateY = emphasis ? interpolate(entrance, [0, 1], [40, 0]) : interpolate(entrance, [0, 1], [14, 0]);
	const opacity = Math.min(entrance, exitProgress);
	const rotate = emphasis ? interpolate(entrance, [0, 1], [-4, 0]) : 0;

	return (
		<div
			style={{
				position: 'absolute',
				top: '50%',
				left: '50%',
				transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
				opacity,
				fontFamily: FONT_STACK,
				fontWeight: emphasis ? 800 : 600,
				fontSize: emphasis ? 132 : 96,
				color: emphasis ? '#fff2e2' : '#e9f6f7',
				letterSpacing: '-0.02em',
				textAlign: 'center',
				textShadow: emphasis
					? '0 0 40px rgba(255,140,70,0.55), 0 6px 24px rgba(0,0,0,0.6)'
					: '0 4px 18px rgba(0,0,0,0.5)',
				whiteSpace: 'nowrap',
			}}
		>
			{cleanForDisplay(word)}
		</div>
	);
};
