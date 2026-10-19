import React from 'react';
import {brand, goldText, serif} from '../brand';

// Card ispirata alle schede consulente della piattaforma: corpo chiaro, bordo arancio, pulsante arancio.
export const OfferCard: React.FC<{
	eyebrow: string;
	headline: string;
	body: string;
	badge: string;
	width: number;
	scale?: number;
}> = ({eyebrow, headline, body, badge, width, scale = 1}) => (
	<div
		style={{
			width,
			borderRadius: 28 * scale,
			background: 'linear-gradient(180deg, rgba(255,255,255,0.97), rgba(233,246,246,0.97))',
			border: `${3 * scale}px solid ${brand.orange}`,
			boxShadow: `0 ${20 * scale}px ${60 * scale}px rgba(0,0,0,0.45), 0 0 ${40 * scale}px ${brand.cyanSoft}`,
			padding: `${30 * scale}px ${30 * scale}px ${26 * scale}px`,
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			textAlign: 'center',
			gap: 10 * scale,
			fontFamily: serif,
		}}
	>
		<div
			style={{
				fontSize: 30 * scale,
				fontWeight: 600,
				fontStyle: 'italic',
				color: brand.indigo,
				lineHeight: 1.15,
			}}
		>
			{eyebrow}
		</div>
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				gap: 10 * scale,
				lineHeight: 1,
				margin: `${4 * scale}px 0`,
			}}
		>
			<span
				style={{
					fontSize: 120 * scale,
					fontWeight: 700,
					...goldText,
					backgroundImage: `linear-gradient(180deg, ${brand.orangeLight}, ${brand.orange} 60%, #c8551a)`,
				}}
			>
				7
			</span>
			<span style={{fontSize: 46 * scale, fontWeight: 700, color: brand.indigo}}>minuti</span>
		</div>
		<div style={{fontSize: 40 * scale, fontWeight: 700, color: brand.indigo, lineHeight: 1.05}}>{headline}</div>
		<div style={{fontSize: 27 * scale, fontWeight: 500, color: '#4a4170', lineHeight: 1.25}}>{body}</div>
		<div
			style={{
				marginTop: 10 * scale,
				width: '100%',
				padding: `${14 * scale}px 0`,
				borderRadius: 14 * scale,
				background: brand.orange,
				color: brand.white,
				fontSize: 28 * scale,
				fontWeight: 700,
				letterSpacing: 0.5,
			}}
		>
			{badge}
		</div>
	</div>
);
