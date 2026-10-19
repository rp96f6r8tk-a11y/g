import React from 'react';
import {brand, sans} from '../brand';

// Logo Klaro7 ricostruito in vettoriale dal marchio della piattaforma:
// mezzo disco ciano, "K" e "O" arancio, mandorla arancio con pupilla ciano.
// Per usare il file ufficiale, sostituire questo SVG con <Img src={staticFile('logo.svg')} />.
export const LOGO_RATIO = 500 / 340;

export const Logo: React.FC<{size?: number; color?: string; symbolOnly?: boolean}> = ({
	size = 120,
	color = brand.white,
	symbolOnly = false,
}) => (
	<svg height={size} width={size * LOGO_RATIO} viewBox="60 48 500 340" style={{overflow: 'visible'}}>
		<path d="M320,50 A168,168 0 0 0 320,386 Z" fill={brand.teal} />
		<path d="M484,240 Q440,350 326,386 Q370,276 484,240 Z" fill={brand.orange} />
		<circle cx={405} cy={313} r={16} fill={brand.teal} />
		{!symbolOnly && <circle cx={440} cy={208} r={17} fill="#1d2f86" />}
		{!symbolOnly && (
			<text x={80} y={246} fontFamily={sans} fontWeight={800} fontSize={104} textLength={468} lengthAdjust="spacing">
				<tspan fill={brand.orange}>K</tspan>
				<tspan fill={color}>LAR</tspan>
				<tspan fill={brand.orange}>O</tspan>
				<tspan fill={color}>7</tspan>
			</text>
		)}
	</svg>
);
