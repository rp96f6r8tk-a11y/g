import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, copy, serif} from '../brand';
import {Logo} from '../components/Logo';
import {
	Almond,
	Atmosphere,
	BrandWipe,
	GlassCard,
	HalfDisc,
	Line,
	SevenMinutes,
	Tag,
	clamp,
	ease,
	orangeGradient,
	progress,
} from './shared';

// Versione 3: le forme del logo diventano il linguaggio visivo (mezzo disco, mandorla, transizioni).
// 10 s a 30 fps, 9:16. Testi tra y≈270 e y≈1250 (safe zone Reels).
const S1 = 0; // Il simbolo si compone attorno a un grande 7
const S2 = 66; // Logo + "Il 7 di ogni mese è il Giorno Klaro7"
const S3 = 126; // Card cashback
const S4 = 190; // Card nuovi iscritti
const S5 = 248; // Chiusura con logo e CTA

const center: React.CSSProperties = {position: 'absolute', left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'};

const SymbolScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const r = 300;
	const cx = 540;
	const cy = 690;
	const disc = progress(frame, 0, 18);
	const almond = progress(frame, 8, 16);
	const seven = spring({frame: frame - 8, fps, config: {damping: 13, mass: 0.9}});
	const length = 384;
	return (
		<AbsoluteFill>
			<div style={{...center, top: 285}}>
				<Line at={4} style={{}}>
					<Tag>Segna la data</Tag>
				</Line>
			</div>
			<HalfDisc
				r={r}
				style={{
					left: cx - r,
					top: cy - r,
					transformOrigin: 'right center',
					transform: `rotate(${(1 - disc) * -180}deg)`,
					opacity: disc,
				}}
			/>
			<Almond
				length={length}
				rotate={137}
				style={{
					left: cx + 153 - length / 2 + (1 - almond) * 220,
					top: cy + 170 - length * 0.24 - (1 - almond) * 200,
					opacity: almond,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: cy - 380,
					textAlign: 'center',
					fontFamily: serif,
					fontWeight: 700,
					fontSize: 700,
					lineHeight: 1,
					color: brand.white,
					transform: `translateX(30px) scale(${0.3 + seven * 0.7})`,
					opacity: interpolate(seven, [0, 0.3], [0, 1], clamp),
					textShadow: '0 30px 80px rgba(8,5,30,0.6)',
				}}
			>
				7
			</div>
			<div style={{...center, top: 1060}}>
				<Line at={24} style={{fontSize: 84, fontStyle: 'italic', fontWeight: 600}}>
					Ogni mese c'è un giorno
				</Line>
				<Line at={30} style={{fontSize: 110}}>
					tutto per te.
				</Line>
			</div>
		</AbsoluteFill>
	);
};

const NameScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - S2 - 4, fps, config: {damping: 14}});
	return (
		<AbsoluteFill>
			<div style={{...center, top: 330, transform: `scale(${0.7 + logo * 0.3})`, opacity: logo}}>
				<Logo size={330} />
			</div>
			<div style={{...center, top: 770, gap: 14}}>
				<Line at={S2 + 10}>
					<Tag>Il 7 di ogni mese è il</Tag>
				</Line>
				<Line at={S2 + 16} style={{fontSize: 150}}>
					Giorno <span style={orangeGradient}>Klaro7</span>
				</Line>
				<Line at={S2 + 24} style={{fontSize: 62, fontStyle: 'italic', fontWeight: 600, color: 'rgba(255,255,255,0.88)'}}>
					Il nostro modo di dirti grazie.
				</Line>
			</div>
		</AbsoluteFill>
	);
};

const OfferCard: React.FC<{
	at: number;
	exitAt?: number;
	fromRight?: boolean;
	accent: string;
	tag: string;
	question: [string, string];
	big: string;
	detail: string;
}> = ({at, exitAt, fromRight, accent, tag, question, big, detail}) => {
	const frame = useCurrentFrame();
	const {fps, width} = useVideoConfig();
	const enter = spring({frame: frame - at, fps, config: {damping: 16, mass: 0.9}});
	const exit = exitAt ? progress(frame, exitAt - 4, 14) : 0;
	const x = fromRight ? (1 - enter) * width : 0;
	const y = fromRight ? 0 : (1 - enter) * 300;
	return (
		<div
			style={{
				position: 'absolute',
				left: 60,
				right: 60,
				top: 300,
				transform: `translate(${x - exit * width * 1.1}px, ${y}px) scale(${0.94 + enter * 0.06}) rotate(${exit * -4}deg)`,
				opacity: fromRight ? 1 : interpolate(enter, [0, 0.4], [0, 1], clamp),
			}}
		>
			<GlassCard accent={accent} style={{padding: '64px 60px 70px 82px', height: 940}}>
				<Tag filled color={accent} size={30}>
					{tag}
				</Tag>
				<div style={{marginTop: 40}}>
					<Line at={at + 6} style={{fontSize: 80}}>
						{question[0]}
					</Line>
					<Line at={at + 10} style={{fontSize: 80}}>
						{question[1]}
					</Line>
				</div>
				<div style={{marginTop: 50}}>
					<SevenMinutes at={at + 14} size={360} />
				</div>
				<div style={{marginTop: 34}}>
					<Line at={at + 22} style={{fontSize: 140, fontStyle: 'italic'}}>
						{big}
					</Line>
					<Line at={at + 26} style={{fontSize: 52, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginTop: 10}}>
						{detail}
					</Line>
				</div>
			</GlassCard>
		</div>
	);
};

const OffersBackdrop: React.FC = () => {
	const frame = useCurrentFrame();
	const drift = Math.sin(frame / 30) * 20;
	return (
		<>
			<HalfDisc r={520} style={{left: -260, top: 140 + drift, opacity: 0.9}} />
			<Almond length={620} rotate={137} style={{left: 560, top: 1240 - drift, opacity: 0.95}} />
		</>
	);
};

const EndScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - S5 - 4, fps, config: {damping: 14}});
	const cta = spring({frame: frame - S5 - 18, fps, config: {damping: 10}});
	const pulse = frame > S5 + 30 ? 1 + Math.abs(Math.sin((frame - S5 - 30) / 6)) * 0.03 : 1;
	const sheen = interpolate(frame, [S5 + 28, S5 + 48], [-60, 160], clamp);
	return (
		<AbsoluteFill>
			<Almond length={560} rotate={137} style={{left: 600, top: 1300, opacity: 0.9}} />
			<div style={{...center, top: 300, transform: `scale(${0.7 + logo * 0.3})`, opacity: logo}}>
				<Logo size={300} />
			</div>
			<div style={{...center, top: 680}}>
				<Line at={S5 + 10} style={{fontSize: 104}}>
					Il tuo 7 ti aspetta.
				</Line>
			</div>
			<div style={{...center, top: 850}}>
				<div
					style={{
						position: 'relative',
						overflow: 'hidden',
						transform: `scale(${cta * pulse})`,
						padding: '32px 76px 36px',
						borderRadius: 999,
						background: `linear-gradient(180deg, ${brand.orangeLight}, ${brand.orange})`,
						color: brand.white,
						fontFamily: serif,
						fontWeight: 700,
						fontSize: 74,
						lineHeight: 1,
						boxShadow: '0 24px 60px rgba(236,122,36,0.55), inset 0 2px 0 rgba(255,255,255,0.35)',
					}}
				>
					{copy.cta} →
					<div
						style={{
							position: 'absolute',
							top: 0,
							bottom: 0,
							left: `${sheen}%`,
							width: '35%',
							background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.5), transparent)',
						}}
					/>
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1050,
					left: 100,
					right: 100,
					textAlign: 'center',
					fontFamily: serif,
					fontWeight: 600,
					fontSize: 33,
					lineHeight: 1.3,
					color: 'rgba(255,255,255,0.82)',
					opacity: interpolate(frame, [S5 + 22, S5 + 34], [0, 1], clamp),
				}}
			>
				{copy.disclaimer}
			</div>
		</AbsoluteFill>
	);
};

export const GiornoKlaro7VideoV3: React.FC = () => {
	const frame = useCurrentFrame();
	const between = (a: number, b: number) => frame >= a && frame < b;
	// Leggero zoom continuo di tutta la scena per dare respiro.
	const breathe = 1 + interpolate(frame, [0, 300], [0, 0.03], {easing: ease});
	return (
		<AbsoluteFill style={{background: brand.night, fontVariantNumeric: 'lining-nums'}}>
			<Atmosphere />
			<AbsoluteFill style={{transform: `scale(${breathe})`}}>
				{between(S1, S2) && <SymbolScene />}
				{between(S2, S3) && <NameScene />}
				{between(S3, S5) && <OffersBackdrop />}
				{between(S3, S4 + 12) && (
					<OfferCard
						at={S3}
						exitAt={S4}
						accent={brand.orange}
						tag="Cashback · ogni 7 del mese"
						question={['Hai ricaricato oltre 100€', 'il mese scorso?']}
						big="in regalo."
						detail="Il nostro grazie per la tua fiducia."
					/>
				)}
				{between(S4, S5) && (
					<OfferCard
						at={S4}
						fromRight
						accent={brand.teal}
						tag="Nuovi iscritti"
						question={['Prima volta', 'su Klaro7?']}
						big="gratis."
						detail="Alla tua prima consulenza."
					/>
				)}
				{frame >= S5 && <EndScene />}
			</AbsoluteFill>
			<BrandWipe at={S2} />
			<BrandWipe at={S3} />
			<BrandWipe at={S5} />
		</AbsoluteFill>
	);
};
