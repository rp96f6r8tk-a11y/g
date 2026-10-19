import React from 'react';
import {AbsoluteFill} from 'remotion';
import {brand, copy, serif} from '../brand';
import {Logo} from '../components/Logo';
import {Almond, Atmosphere, GlassCard, HalfDisc, SevenMinutes, Tag, orangeGradient} from './shared';

// Versione 3 del post 4:5: il simbolo del logo attorno a un grande 7, offerte su card in vetro.
const Offer: React.FC<{accent: string; tag: string; question: string; big: string; detail: string}> = ({
	accent,
	tag,
	question,
	big,
	detail,
}) => (
	<GlassCard accent={accent} style={{width: 464, height: 462, padding: '36px 30px 30px 48px', borderRadius: 36}}>
		<Tag filled color={accent} size={21}>
			{tag}
		</Tag>
		<div style={{fontFamily: serif, fontWeight: 700, fontSize: 36, lineHeight: 1.08, color: brand.white, marginTop: 20, height: 78}}>
			{question}
		</div>
		<div style={{marginTop: 18}}>
			<SevenMinutes at={0} size={156} still />
		</div>
		<div style={{fontFamily: serif, fontWeight: 700, fontStyle: 'italic', fontSize: 68, lineHeight: 1, color: brand.white, marginTop: 12}}>
			{big}
		</div>
		<div style={{fontFamily: serif, fontWeight: 600, fontSize: 30, color: 'rgba(255,255,255,0.88)', marginTop: 8}}>{detail}</div>
	</GlassCard>
);

export const GiornoKlaro7PostV3: React.FC = () => (
	<AbsoluteFill style={{fontVariantNumeric: 'lining-nums', background: brand.night}}>
		<Atmosphere still />
		<HalfDisc r={320} style={{left: 20, top: 80}} />
		<Almond length={330} rotate={137} style={{left: 300, top: 545}} />
		<div
			style={{
				position: 'absolute',
				left: 120,
				top: 30,
				width: 460,
				textAlign: 'center',
				fontFamily: serif,
				fontWeight: 700,
				fontSize: 600,
				lineHeight: 1,
				color: brand.white,
				textShadow: '0 30px 70px rgba(8,5,30,0.55)',
			}}
		>
			7
		</div>

		<div style={{position: 'absolute', right: 60, top: 54}}>
			<Logo size={120} />
		</div>
		<div style={{position: 'absolute', left: 600, right: 50, top: 250, fontFamily: serif, color: brand.white}}>
			<Tag size={24}>Ogni 7 del mese</Tag>
			<div style={{fontSize: 74, fontWeight: 600, fontStyle: 'italic', lineHeight: 1, marginTop: 26}}>è il</div>
			<div style={{fontSize: 128, fontWeight: 700, lineHeight: 0.95}}>Giorno</div>
			<div style={{fontSize: 136, fontWeight: 700, lineHeight: 0.95, ...orangeGradient, paddingBottom: 10}}>Klaro7</div>
		</div>

		<div style={{position: 'absolute', left: 60, right: 60, top: 666, display: 'flex', justifyContent: 'space-between'}}>
			<Offer
				accent={brand.orange}
				tag="Cashback"
				question="Hai ricaricato oltre 100€ il mese scorso?"
				big="in regalo"
				detail="ogni 7 del mese"
			/>
			<Offer accent={brand.teal} tag="Nuovi iscritti" question="Prima volta su Klaro7?" big="gratis" detail="alla prima consulenza" />
		</div>

		<div style={{position: 'absolute', left: 0, right: 0, top: 1150, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
			<div
				style={{
					padding: '20px 60px 24px',
					borderRadius: 999,
					background: `linear-gradient(180deg, ${brand.orangeLight}, ${brand.orange})`,
					color: brand.white,
					fontFamily: serif,
					fontWeight: 700,
					fontSize: 52,
					lineHeight: 1,
					boxShadow: '0 16px 40px rgba(236,122,36,0.5), inset 0 2px 0 rgba(255,255,255,0.35)',
				}}
			>
				{copy.cta} →
			</div>
			<div style={{fontFamily: serif, fontWeight: 600, fontSize: 20, color: 'rgba(255,255,255,0.72)', textAlign: 'center', padding: '0 70px', lineHeight: 1.25}}>
				{copy.disclaimer}
			</div>
		</div>
	</AbsoluteFill>
);
