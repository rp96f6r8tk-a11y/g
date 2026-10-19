import React from 'react';
import {Composition, Still} from 'remotion';
import {GiornoKlaro7Post} from './Post';
import {GiornoKlaro7Video, VIDEO_FPS, VIDEO_FRAMES} from './Video';
import {GiornoKlaro7PostV2} from './v2/PostV2';
import {GiornoKlaro7VideoV2} from './v2/VideoV2';
import {GiornoKlaro7PostV3} from './v3/PostV3';
import {GiornoKlaro7VideoV3} from './v3/VideoV3';

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
		<Composition
			id="GiornoKlaro7VideoV2"
			component={GiornoKlaro7VideoV2}
			durationInFrames={VIDEO_FRAMES}
			fps={VIDEO_FPS}
			width={1080}
			height={1920}
		/>
		<Still id="GiornoKlaro7PostV2" component={GiornoKlaro7PostV2} width={1080} height={1350} />
		<Composition
			id="GiornoKlaro7VideoV3"
			component={GiornoKlaro7VideoV3}
			durationInFrames={VIDEO_FRAMES}
			fps={VIDEO_FPS}
			width={1080}
			height={1920}
		/>
		<Still id="GiornoKlaro7PostV3" component={GiornoKlaro7PostV3} width={1080} height={1350} />
	</>
);
