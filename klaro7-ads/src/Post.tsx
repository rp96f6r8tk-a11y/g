import React from 'react';
import {AbsoluteFill} from 'remotion';
import {brand, copy, goldText, serif} from './brand';
import {CosmicBackground} from './components/CosmicBackground';
import {GlowingSeven} from './components/GlowingSeven';
import {Logo} from './components/Logo';
import {OfferCard} from './components/OfferCard';

// Post Instagram/Facebook feed 4:5 (1080x1350).
export const GiornoKlaro7Post: React.FC = () => (
	<AbsoluteFill style={{background: brand.night, fontVariantNumeric: 'lining-nums'}}>
		<CosmicBackground still glyphOpacity={0.55} waveY={[0.08, 0.62]} />
		<AbsoluteFill style={{padding: '56px 64px 44px', display: 'flex', flexDirection: 'column'}}>
			<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
				<Logo size={90} />
				<div
					style={{
						padding: '8px 24px',
						borderRadius: 999,
						border: `2px solid ${brand.cyan}`,
						color: brand.cyan,
						fontFamily: serif,
						fontWeight: 700,
						fontSize: 26,
						letterSpacing: 4,
						textTransform: 'uppercase',
						background: 'rgba(14,11,38,0.55)',
						boxShadow: `0 0 24px ${brand.cyanSoft}`,
					}}
				>
					Ogni 7 del mese
				</div>
			</div>

			<div style={{flex: 1}} />

			<div style={{display: 'flex', alignItems: 'center', gap: 28}}>
				<GlowingSeven size={400} />
				<div style={{fontFamily: serif, flex: 1}}>
					<div style={{fontSize: 46, fontWeight: 500, fontStyle: 'italic', color: brand.textSoft, lineHeight: 1.1}}>
						C'è un giorno<br />
						che aspetta solo te.
					</div>
					<div style={{fontSize: 92, fontWeight: 700, lineHeight: 0.98, marginTop: 14, ...goldText, paddingBottom: 8}}>
						Il Giorno Klaro7
					</div>
				</div>
			</div>

			<div style={{flex: 1}} />

			<div style={{display: 'flex', gap: 28, justifyContent: 'center'}}>
				<OfferCard
					width={462}
					scale={0.84}
					eyebrow="Hai ricaricato oltre 100€ il mese scorso?"
					headline="in regalo, ogni 7 del mese"
					body="Un cashback per chi ci sceglie con costanza."
					badge="Cashback Giorno Klaro7"
				/>
				<OfferCard
					width={462}
					scale={0.84}
					eyebrow="Prima volta su Klaro7?"
					headline="gratis, per iniziare"
					body="Alla tua prima consulenza con professionisti verificati."
					badge="Promo nuovi iscritti"
				/>
			</div>

			<div style={{flex: 1}} />

			<div style={{textAlign: 'center', fontFamily: serif}}>
				<div style={{fontSize: 44, fontWeight: 600, fontStyle: 'italic', color: brand.white, lineHeight: 1.15}}>
					{copy.tagline}
				</div>
				<div
					style={{
						display: 'inline-block',
						marginTop: 20,
						padding: '16px 52px',
						borderRadius: 16,
						background: `linear-gradient(180deg, ${brand.orangeLight}, ${brand.orange})`,
						color: brand.white,
						fontSize: 38,
						fontWeight: 700,
						boxShadow: `0 12px 36px rgba(236,122,36,0.5)`,
					}}
				>
					{copy.cta} →
				</div>
				<div style={{marginTop: 18, fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,0.55)', lineHeight: 1.3}}>
					{copy.disclaimer}
				</div>
			</div>
		</AbsoluteFill>
	</AbsoluteFill>
);
