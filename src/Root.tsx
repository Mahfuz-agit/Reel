import React from 'react';
import {Composition} from 'remotion';
import {BoringPlanet} from './compositions/BoringPlanet';
import {secondsToFrames, totalAudioDuration} from './utils/audioMath';

const FPS = 30;
const WIDTH = 1080;
const HEIGHT = 1920; // vertical reel (9:16)
const TAIL_SECONDS = 0.6; // small buffer after the last sound so it doesn't cut abruptly

export const RemotionRoot: React.FC = () => {
	const durationInFrames = secondsToFrames(totalAudioDuration() + TAIL_SECONDS, FPS);

	return (
		<Composition
			id="BoringPlanet"
			component={BoringPlanet}
			durationInFrames={durationInFrames}
			fps={FPS}
			width={WIDTH}
			height={HEIGHT}
		/>
	);
};
