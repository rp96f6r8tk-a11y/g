import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {brand, glyphFont} from '../brand';

const GLYPHS = ['♈', '♋', '♌', '♎', '♐', '♑', '♍', '♓'];

const wavePath = (w: number, h: number, phase: number, amp: number, yBase: number) => {
	const pts: string[] = [];
	for (let x = -40; x <= w + 40; x += 30) {
		const y = yBase + Math.sin(x / (w / 2.2) + phase) * amp + Math.sin(x / (w / 5) + phase * 1.7) * amp * 0.25;
		pts.push(`${x},${y.toFixed(1)}`);
	}
	return `M${pts.join(' L')}`;
};

export const CosmicBackground: React.FC<{
	still?: boolean;
	glyphOpacity?: number;
	waveY?: [number, number];
}> = ({still = false, glyphOpacity = 1, waveY = [0.3, 0.72]}) => {
	const frame = useCurrentFrame();
	const {width, height} = useVideoConfig();
	const t = still ? 40 : frame;

	return (
		<AbsoluteFill
			style={{
				background: `radial-gradient(120% 70% at 70% 15%, ${brand.violet} 0%, ${brand.indigo} 38%, ${brand.night} 80%)`,
				overflow: 'hidden',
			}}
		>
			{/* Stelle */}
			{new Array(90).fill(0).map((_, i) => {
				const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t / 18 + i));
				const size = 1.5 + random(`s${i}`) * 3;
				return (
					<div
						key={i}
						style={{
							position: 'absolute',
							left: random(`x${i}`) * width,
							top: random(`y${i}`) * height,
							width: size,
							height: size,
							borderRadius: '50%',
							background: i % 7 === 0 ? brand.gold : brand.white,
							opacity: twinkle * 0.8,
							boxShadow: `0 0 ${size * 3}px ${i % 7 === 0 ? brand.gold : brand.cyan}`,
						}}
					/>
				);
			})}

			{/* Onde ciano, come nell'hero della piattaforma */}
			<svg width={width} height={height} style={{position: 'absolute', inset: 0}}>
				<defs>
					<filter id="glow" x="-20%" y="-50%" width="140%" height="200%">
						<feGaussianBlur stdDeviation="14" result="b" />
						<feMerge>
							<feMergeNode in="b" />
							<feMergeNode in="SourceGraphic" />
						</feMerge>
					</filter>
				</defs>
				<path
					d={wavePath(width, height, t / 22, height * 0.06, height * waveY[0])}
					stroke={brand.cyan}
					strokeOpacity={0.55}
					strokeWidth={22}
					fill="none"
					filter="url(#glow)"
				/>
				<path
					d={wavePath(width, height, t / 30 + 2, height * 0.05, height * waveY[1])}
					stroke={brand.cyan}
					strokeOpacity={0.3}
					strokeWidth={14}
					fill="none"
					filter="url(#glow)"
				/>
			</svg>

			{/* Glifi zodiacali luminosi */}
			{GLYPHS.map((g, i) => {
				const x = random(`gx${i}`) * 0.84 + 0.04;
				const y = random(`gy${i}`) * 0.86 + 0.04;
				const drift = Math.sin(t / 40 + i) * 14;
				return (
					<div
						key={g}
						style={{
							position: 'absolute',
							left: x * width,
							top: y * height + drift,
							fontFamily: glyphFont,
							fontSize: 54 + random(`gs${i}`) * 40,
							color: brand.gold,
							opacity: (0.18 + random(`go${i}`) * 0.22) * glyphOpacity,
							textShadow: `0 0 18px ${brand.goldDeep}`,
						}}
					>
						{g + '︎'}
					</div>
				);
			})}

			{/* Vignettatura */}
			<AbsoluteFill
				style={{background: 'radial-gradient(90% 70% at 50% 50%, transparent 55%, rgba(5,3,20,0.75) 100%)'}}
			/>
		</AbsoluteFill>
	);
};
