import React from 'react';
import {brand, sans} from '../brand';

// Wordmark ricostruito dal logo Klaro7 (cerchio arancio/ciano). Sostituibile con il file ufficiale.
export const Logo: React.FC<{size?: number}> = ({size = 64}) => (
	<div style={{display: 'flex', alignItems: 'center', gap: size * 0.25}}>
		<div
			style={{
				width: size,
				height: size,
				borderRadius: '50%',
				background: `conic-gradient(from 200deg, ${brand.orange} 0 50%, ${brand.cyan} 50% 100%)`,
				boxShadow: `0 0 ${size * 0.4}px ${brand.cyanSoft}`,
			}}
		/>
		<div
			style={{
				fontFamily: sans,
				fontWeight: 800,
				fontSize: size * 0.62,
				letterSpacing: size * 0.04,
				color: brand.white,
			}}
		>
			KLARO<span style={{color: brand.orange}}>7</span>
		</div>
	</div>
);
