import React from 'react';
import {AbsoluteFill} from 'remotion';
import {brand, copy, serif} from '../brand';
import {FlipCalendar} from '../components/FlipCalendar';
import {Logo} from '../components/Logo';

// Versione 2 del post 4:5: tre fasce di colore (indaco, menta, arancio) con testi grandi.
const Offer: React.FC<{question: string; value: string; detail: string}> = ({question, value, detail}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: 34}}>
		<div
			style={{
				flexShrink: 0,
				width: 200,
				height: 200,
				borderRadius: '50%',
				background: brand.orange,
				color: brand.white,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				lineHeight: 0.85,
				boxShadow: '0 10px 26px rgba(236,122,36,0.35)',
			}}
		>
			<span style={{fontSize: 134, fontWeight: 700}}>7</span>
			<span style={{fontSize: 42, fontWeight: 700}}>minuti</span>
		</div>
		<div style={{color: brand.indigo}}>
			<div style={{fontSize: 42, fontWeight: 600, fontStyle: 'italic', lineHeight: 1.1}}>{question}</div>
			<div style={{fontSize: 96, fontWeight: 700, lineHeight: 1, marginTop: 6, color: brand.orangeText}}>{value}</div>
			<div style={{fontSize: 40, fontWeight: 600, lineHeight: 1.1, marginTop: 6}}>{detail}</div>
		</div>
	</div>
);

export const GiornoKlaro7PostV2: React.FC = () => (
	<AbsoluteFill style={{fontFamily: serif, fontVariantNumeric: 'lining-nums', background: brand.mint}}>
		{/* Fascia indaco */}
		<div style={{height: 520, background: brand.indigo, padding: '48px 64px 0', position: 'relative', overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					right: -120,
					top: -260,
					fontSize: 1100,
					fontWeight: 700,
					lineHeight: 1,
					color: 'transparent',
					WebkitTextStroke: `5px ${brand.cyan}`,
					opacity: 0.12,
				}}
			>
				7
			</div>
			<Logo size={90} />
			<div style={{display: 'flex', alignItems: 'center', gap: 50, marginTop: 34}}>
				<FlipCalendar width={300} />
				<div>
					<div style={{fontSize: 52, fontWeight: 600, fontStyle: 'italic', color: brand.cyan, lineHeight: 1}}>
						Ogni 7 del mese
					</div>
					<div style={{fontSize: 104, fontWeight: 700, color: brand.white, lineHeight: 0.95, marginTop: 12}}>
						è il Giorno
						<br />
						<span style={{color: brand.orange}}>Klaro7</span>
					</div>
				</div>
			</div>
		</div>

		{/* Fascia menta: le due offerte */}
		<div style={{padding: '50px 64px 0', display: 'flex', flexDirection: 'column', gap: 36}}>
			<Offer question="Hai ricaricato oltre 100€ il mese scorso?" value="in regalo" detail="il 7 di ogni mese" />
			<div style={{height: 3, background: 'rgba(43,33,99,0.15)', borderRadius: 2}} />
			<Offer question="Prima volta su Klaro7?" value="GRATIS" detail="alla tua prima consulenza" />
		</div>

		{/* Fascia arancio: CTA */}
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: 230,
				background: brand.orange,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				gap: 12,
				padding: '0 64px',
			}}
		>
			<div style={{fontSize: 78, fontWeight: 700, color: brand.white, lineHeight: 1}}>{copy.cta} →</div>
			<div style={{fontSize: 22, fontWeight: 600, color: brand.indigo, textAlign: 'center', lineHeight: 1.25}}>
				{copy.disclaimer}
			</div>
		</div>
	</AbsoluteFill>
);
