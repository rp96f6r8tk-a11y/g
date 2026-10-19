import React from 'react';
import {Composition, Still} from 'remotion';
import {GiornoKlaro7Post} from './Post';
import {GiornoKlaro7Video, VIDEO_FPS, VIDEO_FRAMES} from './Video';

export const RemotionRoot: React.FC = () => (
	<>
		<Composition
			id="GiornoKlaro7Video"
			component={GiornoKlaro7Video}
			durationInFrames={VIDEO_FRAMES}
			fps={VIDEO_FPS}
			width={1080}
			height={1920}
		/>
		<Still id="GiornoKlaro7Post" component={GiornoKlaro7Post} width={1080} height={1350} />
	</>
);
