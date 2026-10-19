import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, copy, serif} from '../brand';
import {FlipCalendar} from '../components/FlipCalendar';
import {Logo} from '../components/Logo';

// Versione 2: blocchi di colore pieni e testi grandi ad alto contrasto, poche parole per schermata.
// 10 s a 30 fps, 9:16. I testi restano tra y≈270 e y≈1250 (safe zone Reels).
const A = 0; // "Segna questa data." + calendario che scatta fino al 7
const B = 60; // "Ogni 7 del mese è il Giorno Klaro7"
const C = 114; // Cashback: 7 minuti in regalo
const D = 180; // Nuovi iscritti: 7 minuti gratis
const E = 237; // Chiusura: logo + CTA

const ease = Easing.bezier(0.22, 1, 0.36, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const progress = (frame: number, from: number, dur: number) => interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: ease});

// Riga di testo che sale da una maschera: nitida appena arrivata, senza sfocature.
const Line: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
	const frame = useCurrentFrame();
	const p = progress(frame, at, 14);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.08em', marginBottom: '-0.08em'}}>
			<div
				style={{
					fontFamily: serif,
					fontWeight: 700,
					lineHeight: 1.02,
					textAlign: 'center',
					transform: `translateY(${(1 - p) * 110}%)`,
					...style,
				}}
			>
				{children}
			</div>
		</div>
	);
};

// Pannello a tutto schermo che entra con una tendina.
const Panel: React.FC<{
	at: number;
	bg: string;
	wipe: 'up' | 'left' | 'circle';
	origin?: [number, number];
	children: React.ReactNode;
}> = ({at, bg, wipe, origin = [540, 960], children}) => {
	const frame = useCurrentFrame();
	if (frame < at) return null;
	const p = progress(frame, at, 12);
	const clipPath =
		wipe === 'up'
			? `inset(${(1 - p) * 100}% 0 0 0)`
			: wipe === 'left'
				? `inset(0 0 0 ${(1 - p) * 100}%)`
				: `circle(${p * 2300}px at ${origin[0]}px ${origin[1]}px)`;
	return <AbsoluteFill style={{background: bg, clipPath}}>{children}</AbsoluteFill>;
};

// Grande 7 in filigrana che ruota piano: dà movimento al fondo senza disturbare la lettura.
const Watermark: React.FC<{color: string; opacity?: number}> = ({color, opacity = 0.1}) => {
	const frame = useCurrentFrame();
	return (
		<div
			style={{
				position: 'absolute',
				right: -260,
				bottom: -420,
				fontFamily: serif,
				fontWeight: 700,
				fontSize: 1700,
				lineHeight: 1,
				color: 'transparent',
				WebkitTextStroke: `6px ${color}`,
				opacity,
				transform: `rotate(${-8 + frame * 0.06}deg)`,
			}}
		>
			7
		</div>
	);
};

const Stack: React.FC<{top: number; children: React.ReactNode; gap?: number}> = ({top, children, gap = 0}) => (
	<div style={{position: 'absolute', top, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap}}>
		{children}
	</div>
);

const BigSeven: React.FC<{at: number; color: string; unitColor: string}> = ({at, color, unitColor}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = spring({frame: frame - at, fps, config: {damping: 11, mass: 0.7}});
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				justifyContent: 'center',
				gap: 24,
				fontFamily: serif,
				fontWeight: 700,
				lineHeight: 0.9,
				transform: `scale(${0.4 + s * 0.6}) rotate(${(1 - s) * -10}deg)`,
				opacity: interpolate(s, [0, 0.25], [0, 1], clamp),
			}}
		>
			<span style={{fontSize: 400, color}}>7</span>
			<span style={{fontSize: 140, color: unitColor}}>minuti</span>
		</div>
	);
};

export const GiornoKlaro7VideoV2: React.FC = () => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();

	// Il calendario: grande al centro nella scena A, poi sale e si rimpicciolisce nella scena B.
	const enter = spring({frame: frame - 2, fps, config: {damping: 14}});
	const toB = progress(frame, B - 4, 18);
	const calY = interpolate(toB, [0, 1], [930, 470]);
	const calScale = enter * interpolate(toB, [0, 1], [1, 0.52]);
	const thump = frame >= 30 ? 1 + Math.sin(Math.min(1, (frame - 30) / 8) * Math.PI) * 0.05 : 1;

	return (
		<AbsoluteFill style={{background: brand.indigo, fontVariantNumeric: 'lining-nums'}}>
			{/* A — fondo indaco */}
			<Watermark color={brand.cyan} opacity={0.12} />
			<Stack top={290}>
				<Line at={34} style={{fontSize: 118, color: brand.white}}>
					Segna questa data.
				</Line>
			</Stack>

			{/* B — fondo menta che si apre dal calendario */}
			<Panel at={B} bg={brand.mint} wipe="circle" origin={[540, 930]}>
				<Watermark color={brand.indigo} opacity={0.06} />
				<Stack top={720} gap={6}>
					<Line at={B + 8} style={{fontSize: 84, color: brand.indigo, fontStyle: 'italic', fontWeight: 600}}>
						Ogni 7 del mese
					</Line>
					<Line at={B + 14} style={{fontSize: 150, color: brand.indigo}}>
						è il Giorno
					</Line>
					<Line at={B + 20} style={{fontSize: 190, color: brand.orangeText}}>
						Klaro7
					</Line>
				</Stack>
			</Panel>

			{frame < C + 12 && (
				<div
					style={{
						position: 'absolute',
						left: '50%',
						top: calY,
						transform: `translate(-50%, -50%) scale(${calScale * thump})`,
					}}
				>
					<FlipCalendar width={560} numbers={[3, 4, 5, 6, 7]} start={6} interval={6} flipDuration={8} />
				</div>
			)}

			{/* C — cashback, fondo arancio */}
			<Panel at={C} bg={brand.orange} wipe="up">
				<Watermark color={brand.white} opacity={0.14} />
				<Stack top={300} gap={4}>
					<Line at={C + 6} style={{fontSize: 94, color: brand.indigo}}>
						Hai ricaricato
					</Line>
					<Line at={C + 10} style={{fontSize: 94, color: brand.indigo}}>
						oltre 100€
					</Line>
					<Line at={C + 14} style={{fontSize: 94, color: brand.indigo}}>
						il mese scorso?
					</Line>
					<div style={{height: 10}} />
					<BigSeven at={C + 20} color={brand.white} unitColor={brand.white} />
					<Line at={C + 26} style={{fontSize: 120, color: brand.indigo}}>
						in regalo
					</Line>
					<Line at={C + 32} style={{fontSize: 72, color: brand.indigo, fontStyle: 'italic', fontWeight: 600}}>
						il 7 di ogni mese
					</Line>
				</Stack>
			</Panel>

			{/* D — nuovi iscritti, fondo menta */}
			<Panel at={D} bg={brand.mint} wipe="left">
				<Watermark color={brand.orange} opacity={0.12} />
				<Stack top={340} gap={4}>
					<Line at={D + 6} style={{fontSize: 96, color: brand.indigo}}>
						Prima volta
					</Line>
					<Line at={D + 10} style={{fontSize: 96, color: brand.indigo}}>
						su Klaro7?
					</Line>
					<div style={{height: 30}} />
					<BigSeven at={D + 16} color={brand.orangeText} unitColor={brand.indigo} />
					<Line at={D + 24} style={{fontSize: 150, color: brand.orangeText}}>
						GRATIS
					</Line>
					<Line at={D + 30} style={{fontSize: 64, color: brand.indigo, fontStyle: 'italic', fontWeight: 600}}>
						alla tua prima consulenza
					</Line>
				</Stack>
			</Panel>

			{/* E — chiusura, fondo indaco */}
			<Panel at={E} bg={brand.indigo} wipe="circle" origin={[540, 1000]}>
				<Watermark color={brand.cyan} opacity={0.12} />
				<EndCard />
			</Panel>
		</AbsoluteFill>
	);
};

const EndCard: React.FC = () => {
	const frame = useCurrentFrame() - E;
	const {fps} = useVideoConfig();
	const logo = spring({frame: frame - 4, fps, config: {damping: 14}});
	const cta = spring({frame: frame - 18, fps, config: {damping: 10}});
	const pulse = frame > 30 ? 1 + Math.abs(Math.sin((frame - 30) / 6)) * 0.03 : 1;
	return (
		<>
			<div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center', opacity: logo, transform: `scale(${0.8 + logo * 0.2})`}}>
				<Logo size={150} />
			</div>
			<Stack top={480} gap={4}>
				<Line at={E + 8} style={{fontSize: 110, color: brand.white}}>
					Il tuo 7
				</Line>
				<Line at={E + 12} style={{fontSize: 110, color: brand.white}}>
					ti aspetta.
				</Line>
			</Stack>
			<div style={{position: 'absolute', top: 790, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
				<div
					style={{
						transform: `scale(${cta * pulse})`,
						padding: '30px 72px',
						borderRadius: 999,
						background: brand.orange,
						color: brand.white,
						fontFamily: serif,
						fontWeight: 700,
						fontSize: 76,
						boxShadow: '0 18px 50px rgba(236,122,36,0.5)',
					}}
				>
					{copy.cta} →
				</div>
			</div>
			<div
				style={{
					position: 'absolute',
					top: 1010,
					left: 90,
					right: 90,
					textAlign: 'center',
					fontFamily: serif,
					fontWeight: 600,
					fontSize: 34,
					lineHeight: 1.3,
					color: 'rgba(255,255,255,0.8)',
					opacity: interpolate(frame, [20, 32], [0, 1], clamp),
				}}
			>
				{copy.disclaimer}
			</div>
		</>
	);
};
