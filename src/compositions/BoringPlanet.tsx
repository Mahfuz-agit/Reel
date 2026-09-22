import React from 'react';
import {AbsoluteFill, Audio, staticFile, useVideoConfig} from 'remotion';
import {AUDIO_DATA, secondsToFrames} from '../utils/audioMath';
import {BackgroundMood} from '../components/BackgroundMood';
import {ParticleField} from '../components/ParticleField';
import {GlowPulse} from '../components/GlowPulse';
import {LightLeakSweep} from '../components/LightLeakSweep';
import {GrainOverlay} from '../components/GrainOverlay';
import {Vignette} from '../components/Vignette';
import {WordCaption} from '../scenes/WordCaption';

// Strip trailing punctuation for matching, keep it for display.
const stripPunct = (w: string) => w.replace(/[.,!?]/g, '').toLowerCase();

const EMPHASIS_WORDS = new Set([
	'dragons',
	'wizards',
	'fairies',
	'ring',
	'golems',
	'orcs',
	'elves',
	'dwarves',
	'idiots',
	'hexes',
	'woohoo',
]);

export const BoringPlanet: React.FC = () => {
	const {fps} = useVideoConfig();

	return (
		<AbsoluteFill style={{backgroundColor: '#000'}}>
			<BackgroundMood />
			<ParticleField depth="back" count={18} />
			<GlowPulse />
			<ParticleField depth="front" count={14} />

			{AUDIO_DATA.transcript.map((w, i) => {
				const startFrame = secondsToFrames(w.start, fps);
				const endFrame = secondsToFrames(w.end, fps);
				const emphasis = EMPHASIS_WORDS.has(stripPunct(w.word));
				return (
					<WordCaption
						key={`${i}-${w.word}`}
						word={w.word}
						startFrame={startFrame}
						endFrame={endFrame}
						emphasis={emphasis}
					/>
				);
			})}

			<LightLeakSweep />
			<Vignette />
			<GrainOverlay />

			{/*
			  IMPORTANT: put your real audio file at public/audio.mp3
			  (see README.md — this JSON only has the analysis, not the sound itself).
			*/}
			<Audio src={staticFile('audio.mp3')} />
		</AbsoluteFill>
	);
};
