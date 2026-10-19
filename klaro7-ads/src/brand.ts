import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

// Colori ricavati dalla piattaforma Klaro7 (navbar indaco, glow ciano, CTA arancio).
export const brand = {
	night: '#0e0b26',
	indigo: '#2b2163',
	navbar: '#3a2d6e',
	violet: '#5b3fa6',
	cyan: '#3fe3ea',
	// Ciano più profondo del mezzo disco nel logo.
	teal: '#1fa8b1',
	cyanSoft: 'rgba(63, 227, 234, 0.35)',
	orange: '#ec7a24',
	orangeLight: '#ff9a45',
	// Arancio più scuro per testi su fondo chiaro (contrasto migliore).
	orangeText: '#d45f0e',
	gold: '#ffd38a',
	goldDeep: '#f2a94b',
	mint: '#e9f6f6',
	white: '#ffffff',
	textSoft: 'rgba(255, 255, 255, 0.78)',
};

// Font locali in public/fonts (Google Fonts, licenza OFL): il render funziona anche offline.
export const serif = 'Cormorant Garamond';
loadFont({family: serif, url: staticFile('fonts/CormorantGaramond-Variable.woff2'), weight: '300 700', style: 'normal'});
loadFont({family: serif, url: staticFile('fonts/CormorantGaramond-Italic-Variable.woff2'), weight: '300 700', style: 'italic'});
export const sans = 'Inter';
loadFont({family: sans, url: staticFile('fonts/Inter-ExtraBold.woff2'), weight: '800'});

// I glifi zodiacali non sono in Cormorant: ricadono su DejaVu Sans (presentazione testo, non emoji).
export const glyphFont = `'DejaVu Sans', sans-serif`;

export const goldText = {
	backgroundImage: `linear-gradient(180deg, #fff4d6 0%, ${brand.gold} 40%, ${brand.goldDeep} 100%)`,
	WebkitBackgroundClip: 'text',
	backgroundClip: 'text',
	color: 'transparent',
} as const;

export const copy = {
	tagline: 'Le stelle parlano. Noi ti aiutiamo ad ascoltarle.',
	disclaimer:
		'7 minuti gratis per i nuovi iscritti alla prima consulenza. Cashback di 7 minuti accreditato il 7 di ogni mese a chi ha ricaricato oltre 100€ nel mese precedente.',
	cta: 'Scopri i consulenti',
};
