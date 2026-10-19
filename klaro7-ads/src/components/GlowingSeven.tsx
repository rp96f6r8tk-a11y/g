import React from 'react';
import {brand, goldText, serif} from '../brand';

// Il "7" protagonista: numerale in oro dentro un anello ciano, come una carta che si accende.
export const GlowingSeven: React.FC<{size: number; ring?: number; glow?: number}> = ({
	size,
	ring = 1,
	glow = 1,
}) => {
	const r = size * 0.46;
	const circ = 2 * Math.PI * r;
	return (
		<div style={{position: 'relative', width: size, height: size}}>
			<div
				style={{
					position: 'absolute',
					inset: -size * 0.15,
					borderRadius: '50%',
					background: `radial-gradient(circle, rgba(255,211,138,${0.35 * glow}) 0%, rgba(63,227,234,${0.18 * glow}) 45%, transparent 70%)`,
				}}
			/>
			<svg width={size} height={size} style={{position: 'absolute', inset: 0}}>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					fill="none"
					stroke={brand.cyan}
					strokeWidth={size * 0.012}
					strokeDasharray={circ}
					strokeDashoffset={circ * (1 - ring)}
					transform={`rotate(-90 ${size / 2} ${size / 2})`}
					style={{filter: `drop-shadow(0 0 ${size * 0.03}px ${brand.cyan})`}}
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r * 0.86}
					fill="none"
					stroke={brand.gold}
					strokeOpacity={0.45}
					strokeWidth={size * 0.004}
					strokeDasharray={`${size * 0.01} ${size * 0.025}`}
				/>
			</svg>
			<div
				style={{
					position: 'absolute',
					inset: 0,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: serif,
					fontWeight: 700,
					fontSize: size * 0.82,
					lineHeight: 1,
					paddingBottom: size * 0.06,
					...goldText,
					filter: `drop-shadow(0 0 ${size * 0.05 * glow}px rgba(255,190,100,0.85))`,
				}}
			>
				7
			</div>
		</div>
	);
};
