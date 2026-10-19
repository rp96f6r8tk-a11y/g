import React from 'react';
import {AbsoluteFill, Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, serif} from '../brand';

// Elementi grafici della versione 3, presi dalle forme del logo (mezzo disco ciano, mandorla arancio).

export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const progress = (frame: number, from: number, dur: number) =>
	interpolate(frame, [from, from + dur], [0, 1], {...clamp, easing: ease});

export const orangeGradient = {
	backgroundImage: `linear-gradient(170deg, #ffc27d 0%, ${brand.orangeLight} 35%, ${brand.orange} 70%, #d4580c 100%)`,
	WebkitBackgroundClip: 'text',
	backgroundClip: 'text',
	color: 'transparent',
} as const;

// Fondo: indaco profondo con due luci (ciano e arancio) che respirano, polvere luminosa e grana.
export const Atmosphere: React.FC<{still?: boolean}> = ({still = false}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = still ? 0 : frame;
	return (
		<AbsoluteFill style={{background: `linear-gradient(165deg, #2e2470 0%, ${brand.indigo} 40%, #151036 100%)`, overflow: 'hidden'}}>
			<div
				style={{
					position: 'absolute',
					width: width * 1.2,
					height: width * 1.2,
					left: -width * 0.45 + Math.sin(t / 50) * 40,
					top: -width * 0.35 + Math.cos(t / 60) * 40,
					background: `radial-gradient(circle, rgba(31,168,177,0.42) 0%, transparent 62%)`,
				}}
			/>
			<div
				style={{
					position: 'absolute',
					width: width * 1.3,
					height: width * 1.3,
					right: -width * 0.55 + Math.cos(t / 45) * 40,
					bottom: -width * 0.45 + Math.sin(t / 55) * 40,
					background: `radial-gradient(circle, rgba(236,122,36,0.32) 0%, transparent 60%)`,
				}}
			/>
			{new Array(36).fill(0).map((_, i) => {
				const speed = 0.6 + random(`sp${i}`) * 1.2;
				const y = (((random(`py${i}`) * height - t * speed) % height) + height) % height;
				const size = 3 + random(`ps${i}`) * 5;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: random(`px${i}`) * width,
							top: y,
							width: size,
							height: size,
							borderRadius: '50%',
							background: i % 3 === 0 ? brand.orangeLight : brand.cyan,
							opacity: 0.25 + random(`po${i}`) * 0.35,
							boxShadow: `0 0 ${size * 3}px currentColor`,
						}}
					/>
				);
			})}
			<svg width={width} height={height} style={{position: 'absolute', inset: 0, opacity: 0.09, mixBlendMode: 'overlay'}}>
				<filter id="grain">
					<feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
					<feColorMatrix type="saturate" values="0" />
				</filter>
				<rect width="100%" height="100%" filter="url(#grain)" />
			</svg>
		</AbsoluteFill>
	);
};

// Mezzo disco ciano del logo (metà sinistra di un cerchio di raggio r).
export const HalfDisc: React.FC<{r: number; style?: React.CSSProperties; color?: string}> = ({r, style, color = brand.teal}) => (
	<div
		style={{
			position: 'absolute',
			width: r,
			height: r * 2,
			borderRadius: `${r}px 0 0 ${r}px`,
			background: `linear-gradient(160deg, #2cc3cb 0%, ${color} 55%, #168a92 100%)`,
			...style,
		}}
	/>
);

// Mandorla arancio con pupilla ciano, come nel logo. Orizzontale di base, si ruota con `rotate`.
export const Almond: React.FC<{length: number; rotate?: number; style?: React.CSSProperties; pupil?: boolean}> = ({
	length,
	rotate = 0,
	style,
	pupil = true,
}) => {
	const w = length * 0.24;
	return (
		<svg
			width={length}
			height={w * 2}
			viewBox={`0 ${-w} ${length} ${w * 2}`}
			style={{position: 'absolute', overflow: 'visible', transform: `rotate(${rotate}deg)`, ...style}}
		>
			<defs>
				<linearGradient id={`alm${length}`} x1="0" x2="1">
					<stop offset="0" stopColor="#d4580c" />
					<stop offset="0.5" stopColor={brand.orange} />
					<stop offset="1" stopColor={brand.orangeLight} />
				</linearGradient>
			</defs>
			<path d={`M0,0 Q${length / 2},${-w} ${length},0 Q${length / 2},${w} 0,0 Z`} fill={`url(#alm${length})`} />
			{pupil && <circle cx={length / 2} cy={0} r={w * 0.32} fill={brand.teal} />}
		</svg>
	);
};

// Riga di testo che sale da una maschera.
export const Line: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; still?: boolean}> = ({
	at,
	children,
	style,
	still,
}) => {
	const frame = useCurrentFrame();
	const p = still ? 1 : progress(frame, at, 15);
	return (
		<div style={{overflow: 'hidden', paddingBottom: '0.1em', marginBottom: '-0.1em'}}>
			<div
				style={{
					fontFamily: serif,
					fontWeight: 700,
					lineHeight: 1.02,
					color: brand.white,
					transform: `translateY(${(1 - p) * 115}%)`,
					...style,
				}}
			>
				{children}
			</div>
		</div>
	);
};

// Etichetta in maiuscoletto spaziato.
export const Tag: React.FC<{children: React.ReactNode; color?: string; size?: number; filled?: boolean}> = ({
	children,
	color = brand.cyan,
	size = 34,
	filled = false,
}) => (
	<div
		style={{
			display: 'inline-block',
			fontFamily: serif,
			fontWeight: 700,
			fontSize: size,
			letterSpacing: size * 0.22,
			textTransform: 'uppercase',
			color: filled ? brand.white : color,
			background: filled ? color : 'transparent',
			border: filled ? 'none' : `2px solid ${color}`,
			padding: `${size * 0.28}px ${size * 0.7}px ${size * 0.22}px`,
			borderRadius: 999,
			lineHeight: 1,
			fontVariantNumeric: 'lining-nums',
			fontFeatureSettings: '"lnum" 1',
		}}
	>
		{children}
	</div>
);

// Card in vetro satinato con bordo luminoso.
export const GlassCard: React.FC<{children: React.ReactNode; style?: React.CSSProperties; accent?: string}> = ({
	children,
	style,
	accent = brand.orange,
}) => (
	<div
		style={{
			position: 'relative',
			borderRadius: 48,
			background: 'linear-gradient(160deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 100%)',
			border: '2px solid rgba(255,255,255,0.22)',
			boxShadow: `0 40px 90px rgba(8,5,30,0.55), inset 0 1px 0 rgba(255,255,255,0.3), 0 0 0 1px ${accent}22`,
			backdropFilter: 'blur(28px)',
			WebkitBackdropFilter: 'blur(28px)',
			overflow: 'hidden',
			...style,
		}}
	>
		<div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: accent}} />
		{children}
	</div>
);

// Il grande "7 minuti" delle offerte.
export const SevenMinutes: React.FC<{at: number; size?: number; still?: boolean}> = ({at, size = 400, still}) => {
	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const s = still ? 1 : spring({frame: frame - at, fps, config: {damping: 12, mass: 0.8}});
	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'baseline',
				gap: size * 0.05,
				fontFamily: serif,
				fontWeight: 700,
				lineHeight: 0.82,
				transform: `scale(${0.5 + s * 0.5})`,
				transformOrigin: 'left bottom',
				opacity: interpolate(s, [0, 0.3], [0, 1], clamp),
			}}
		>
			<span style={{fontSize: size, ...orangeGradient, filter: 'drop-shadow(0 10px 30px rgba(236,122,36,0.45))'}}>7</span>
			<span style={{fontSize: size * 0.32, color: brand.white}}>minuti</span>
		</div>
	);
};

// Transizione di marca: il mezzo disco ciano attraversa lo schermo, preceduto da un bordo arancio.
export const BrandWipe: React.FC<{at: number}> = ({at}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const p = interpolate(frame, [at - 7, at + 7], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	if (p <= 0 || p >= 1) return null;
	const shapeW = width * 1.3;
	const left = interpolate(p, [0, 1], [-shapeW, width]);
	const shape = (offset: number, background: string) => (
		<div
			style={{
				position: 'absolute',
				top: -height * 0.3,
				height: height * 1.6,
				width: shapeW,
				left: left + offset,
				borderRadius: `0 ${height * 0.8}px ${height * 0.8}px 0 / 0 ${height * 0.8}px ${height * 0.8}px 0`,
				background,
			}}
		/>
	);
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{shape(70, brand.orange)}
			{shape(0, `linear-gradient(90deg, #168a92, ${brand.teal} 70%, #2cc3cb)`)}
		</AbsoluteFill>
	);
};
