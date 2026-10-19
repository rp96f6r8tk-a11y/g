import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';
import {brand, serif} from '../brand';

const ease = Easing.bezier(0.45, 0, 0.2, 1);

// Pagina di calendario a palette: scorre i numeri e si ferma sull'ultimo (il 7).
export const FlipCalendar: React.FC<{
	width: number;
	numbers?: number[];
	start?: number;
	interval?: number;
	flipDuration?: number;
	label?: string;
}> = ({width, numbers = [7], start = 0, interval = 8, flipDuration = 10, label = 'Ogni mese'}) => {
	const frame = useCurrentFrame();
	const height = width * 1.12;
	const header = height * 0.2;
	const body = height - header;
	const fontSize = body * 0.92;

	// Quale scatto è in corso e a che punto.
	let a = numbers[0];
	let b = numbers[0];
	let p = 1;
	for (let i = 0; i < numbers.length - 1; i++) {
		const t = start + i * interval;
		if (frame >= t) {
			a = numbers[i];
			b = numbers[i + 1];
			p = interpolate(frame - t, [0, flipDuration], [0, 1], {extrapolateRight: 'clamp', easing: ease});
		}
	}
	if (numbers.length > 1 && frame < start) {
		b = a;
	}

	const half = (n: number, which: 'top' | 'bottom', style: React.CSSProperties = {}) => (
		<div
			style={{
				position: 'absolute',
				left: 0,
				right: 0,
				top: which === 'top' ? 0 : body / 2,
				height: body / 2,
				overflow: 'hidden',
				background: which === 'top' ? '#ffffff' : '#f1f0f8',
				backfaceVisibility: 'hidden',
				...style,
			}}
		>
			<div
				style={{
					position: 'absolute',
					left: 0,
					right: 0,
					top: which === 'top' ? 0 : -body / 2,
					height: body,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: serif,
					fontWeight: 700,
					fontSize,
					lineHeight: 1,
					color: brand.indigo,
					paddingBottom: body * 0.04,
				}}
			>
				{n}
			</div>
		</div>
	);

	return (
		<div
			style={{
				width,
				height,
				borderRadius: width * 0.08,
				overflow: 'hidden',
				boxShadow: `0 ${width * 0.06}px ${width * 0.14}px rgba(8, 5, 30, 0.45)`,
				position: 'relative',
				fontVariantNumeric: 'lining-nums',
			}}
		>
			<div
				style={{
					height: header,
					background: brand.orange,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					fontFamily: serif,
					fontWeight: 700,
					fontSize: header * 0.42,
					letterSpacing: header * 0.06,
					textTransform: 'uppercase',
					color: brand.white,
				}}
			>
				{label}
			</div>
			<div style={{position: 'relative', height: body, perspective: width * 3}}>
				{half(b, 'top')}
				{half(p < 1 ? a : b, 'bottom')}
				{p < 0.5 &&
					half(a, 'top', {
						transformOrigin: 'bottom center',
						transform: `rotateX(${-180 * p}deg)`,
						filter: `brightness(${1 - p * 0.5})`,
					})}
				{p >= 0.5 &&
					p < 1 &&
					half(b, 'bottom', {
						transformOrigin: 'top center',
						transform: `rotateX(${180 * (1 - p)}deg)`,
						filter: `brightness(${0.5 + p * 0.5})`,
					})}
				<div
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						top: body / 2 - 1.5,
						height: 3,
						background: 'rgba(43, 33, 99, 0.18)',
					}}
				/>
			</div>
		</div>
	);
};
