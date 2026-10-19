import React from 'react';
import {
	AbsoluteFill,
	Easing,
	Sequence,
	interpolate,
	spring,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {brand, copy, goldText, serif} from './brand';
import {CosmicBackground} from './components/CosmicBackground';
import {GlowingSeven} from './components/GlowingSeven';
import {Logo} from './components/Logo';
import {OfferCard} from './components/OfferCard';

// 10 secondi a 30 fps, formato 9:16 per Reels/Storie Meta.
// Testi e CTA restano tra ~14% in alto e ~35% in basso (safe zone dell'interfaccia Reels).
export const VIDEO_FPS = 30;
export const VIDEO_FRAMES = 300;

const S1 = 0; // Hook: "Ogni mese c'è un giorno che aspetta solo te."
const S2 = 72; // Rivelazione: "Il 7 di ogni mese è il Giorno Klaro7"
const S3 = 138; // Offerte: cashback + nuovi iscritti
const S4 = 228; // Chiusura: tagline + logo + CTA

const ease = Easing.bezier(0.22, 1, 0.36, 1);

// Testo che emerge dal blur, parola per parola.
const Reveal: React.FC<{
	text: string;
	delay?: number;
	size: number;
	weight?: number;
	italic?: boolean;
	gold?: boolean;
	color?: string;
	stagger?: number;
}> = ({text, delay = 0, size, weight = 600, italic, gold, color = brand.white, stagger = 4}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				fontFamily: serif,
				fontSize: size,
				fontWeight: weight,
				fontStyle: italic ? 'italic' : 'normal',
				lineHeight: 1.08,
				textAlign: 'center',
				display: 'flex',
				flexWrap: 'wrap',
				justifyContent: 'center',
				columnGap: size * 0.24,
			}}
		>
			{text.split(' ').map((w, i) => {
				const p = interpolate(frame - delay - i * stagger, [0, 16], [0, 1], {
					extrapolateLeft: 'clamp',
					extrapolateRight: 'clamp',
					easing: ease,
				});
				return (
					<span
						key={i}
						style={{
							display: 'inline-block',
							opacity: p,
							transform: `translateY(${(1 - p) * size * 0.4}px)`,
							filter: `blur(${(1 - p) * 10}px)`,
							color: gold ? undefined : color,
							...(gold ? goldText : {}),
							textShadow: gold ? undefined : '0 4px 28px rgba(5,3,20,0.9)',
							paddingBottom: size * 0.08,
						}}
					>
						{w}
					</span>
				);
			})}
		</div>
	);
};

const sceneFade = (frame: number, duration: number) =>
	interpolate(frame, [duration - 8, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});

// Il "7" vive per tutto il video: nasce al centro, sale, poi resta come presenza sullo sfondo.
const HeroSeven: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps, height} = useVideoConfig();
	const birth = spring({frame: frame - 4, fps, config: {damping: 14, mass: 0.9}});
	const ring = interpolate(frame, [6, 50], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	const pulse = 1 + Math.sin(frame / 7) * 0.08;

	const toS2 = interpolate(frame, [S2 - 6, S2 + 14], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	const toS3 = interpolate(frame, [S3 - 8, S3 + 10], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});
	const toS4 = interpolate(frame, [S4 - 6, S4 + 16], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

	const y = interpolate(toS2, [0, 1], [height * 0.38, height * 0.27]) - toS4 * height * 0.06;
	const scale = birth * interpolate(toS2, [0, 1], [1, 0.82]) * interpolate(toS3, [0, 1], [1, 1.9]) * interpolate(toS4, [0, 1], [1, 0.34]);
	const opacity = interpolate(toS3, [0, 1], [1, 0.12]) + toS4 * 0.88;

	return (
		<div
			style={{
				position: 'absolute',
				left: '50%',
				top: y,
				transform: `translate(-50%, -50%) scale(${scale}) rotate(${(1 - birth) * -25}deg)`,
				opacity,
			}}
		>
			<GlowingSeven size={620} ring={ring} glow={pulse} />
		</div>
	);
};

const HookScene: React.FC = () => {
	const frame = useCurrentFrame();
	return (
		<AbsoluteFill style={{opacity: sceneFade(frame, S2 - S1), padding: '0 80px'}}>
			<div style={{position: 'absolute', top: 280, left: 80, right: 80}}>
				<Reveal text="Ogni mese c'è un giorno" delay={6} size={92} />
			</div>
			<div style={{position: 'absolute', top: 1080, left: 80, right: 80}}>
				<Reveal text="che aspetta solo te." delay={26} size={104} italic gold weight={700} />
			</div>
		</AbsoluteFill>
	);
};

const RevealScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const chip = spring({frame: frame - 2, fps, config: {damping: 12}});
	return (
		<AbsoluteFill style={{opacity: sceneFade(frame, S3 - S2)}}>
			<div
				style={{
					position: 'absolute',
					top: 830,
					left: 0,
					right: 0,
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					gap: 26,
					padding: '0 70px',
				}}
			>
				<div
					style={{
						transform: `scale(${chip})`,
						padding: '12px 34px',
						borderRadius: 999,
						border: `2px solid ${brand.cyan}`,
						color: brand.cyan,
						fontFamily: serif,
						fontWeight: 700,
						fontSize: 40,
						letterSpacing: 6,
						textTransform: 'uppercase',
						boxShadow: `0 0 30px ${brand.cyanSoft}`,
						background: 'rgba(14,11,38,0.5)',
					}}
				>
					Il 7 di ogni mese
				</div>
				<Reveal text="è il Giorno Klaro7" delay={8} size={128} gold weight={700} stagger={5} />
				<Reveal text="Il nostro modo di dirti grazie." delay={26} size={60} italic color={brand.textSoft} weight={500} stagger={3} />
			</div>
		</AbsoluteFill>
	);
};

const flipIn = (frame: number, fps: number, delay: number) => {
	const s = spring({frame: frame - delay, fps, config: {damping: 15, mass: 0.8}});
	return {
		opacity: interpolate(s, [0, 0.3], [0, 1], {extrapolateRight: 'clamp'}),
		transform: `perspective(1600px) translateY(${(1 - s) * 220}px) rotateY(${(1 - s) * 95}deg) rotateZ(${(1 - s) * -6}deg)`,
	};
};

const OffersScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill
			style={{
				opacity: sceneFade(frame, S4 - S3),
				alignItems: 'center',
				justifyContent: 'center',
				gap: 40,
				padding: '0 70px 330px',
			}}
		>
			<div style={flipIn(frame, fps, 2)}>
				<OfferCard
					width={940}
					scale={1.12}
					eyebrow="Hai ricaricato oltre 100€ il mese scorso?"
					headline="in regalo, ogni 7 del mese"
					body="Un cashback per chi ci sceglie con costanza."
					badge="Cashback Giorno Klaro7"
				/>
			</div>
			<div style={flipIn(frame, fps, 30)}>
				<OfferCard
					width={940}
					scale={1.12}
					eyebrow="Prima volta su Klaro7?"
					headline="gratis, per iniziare"
					body="Alla tua prima consulenza con professionisti verificati."
					badge="Promo nuovi iscritti"
				/>
			</div>
		</AbsoluteFill>
	);
};

const CloseScene: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - 20, fps, config: {damping: 14}});
	const cta = spring({frame: frame - 30, fps, config: {damping: 10}});
	const pulse = 1 + Math.max(0, Math.sin((frame - 40) / 5)) * 0.035 * (frame > 40 ? 1 : 0);
	const sheen = interpolate(frame, [42, 66], [-120, 220], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
	return (
		<AbsoluteFill style={{alignItems: 'center', padding: '0 80px'}}>
			<div style={{position: 'absolute', top: 600, left: 80, right: 80}}>
				<Reveal text={copy.tagline} delay={2} size={92} italic weight={600} stagger={3} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: 860,
					opacity: logo,
					transform: `translateY(${(1 - logo) * 40}px)`,
				}}
			>
				<Logo size={84} />
			</div>
			<div
				style={{
					position: 'absolute',
					top: 985,
					transform: `scale(${cta * pulse})`,
					padding: '30px 70px',
					borderRadius: 22,
					background: `linear-gradient(180deg, ${brand.orangeLight}, ${brand.orange})`,
					color: brand.white,
					fontFamily: serif,
					fontSize: 60,
					fontWeight: 700,
					boxShadow: `0 18px 50px rgba(236,122,36,0.55)`,
					overflow: 'hidden',
				}}
			>
				{copy.cta} →
				<div
					style={{
						position: 'absolute',
						top: 0,
						bottom: 0,
						left: `${sheen}%`,
						width: '40%',
						background: 'linear-gradient(100deg, transparent, rgba(255,255,255,0.45), transparent)',
					}}
				/>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1135,
					left: 90,
					right: 90,
					textAlign: 'center',
					fontFamily: serif,
					fontSize: 30,
					fontWeight: 500,
					lineHeight: 1.3,
					color: 'rgba(255,255,255,0.6)',
					opacity: interpolate(frame, [30, 45], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
				}}
			>
				{copy.disclaimer}
			</div>
		</AbsoluteFill>
	);
};

export const GiornoKlaro7Video: React.FC = () => {
	const frame = useCurrentFrame();
	// Lampo di luce ai cambi scena principali.
	const flash = [S2, S3, S4]
		.map((s) => interpolate(frame, [s - 3, s, s + 10], [0, 0.22, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}))
		.reduce((a, b) => a + b, 0);

	return (
		<AbsoluteFill style={{background: brand.night, fontVariantNumeric: 'lining-nums'}}>
			<CosmicBackground />
			<HeroSeven />
			<Sequence from={S1} durationInFrames={S2 - S1}>
				<HookScene />
			</Sequence>
			<Sequence from={S2} durationInFrames={S3 - S2}>
				<RevealScene />
			</Sequence>
			<Sequence from={S3} durationInFrames={S4 - S3}>
				<OffersScene />
			</Sequence>
			<Sequence from={S4}>
				<CloseScene />
			</Sequence>
			<AbsoluteFill style={{background: brand.cyan, opacity: flash, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};
