'use strict';

const { UserPricingState, PACKAGES, PROMO_RATE, calcPackageCredit } = require('../src/engine');

let passed = 0;
let failed = 0;

function assert(condition, testName, detail = '') {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ ${testName}${detail ? ` — ${detail}` : ''}`);
    failed++;
  }
}

function approxEqual(a, b, tolerance = 0.001) {
  return Math.abs(a - b) < tolerance;
}

// ─── TEST 1: calcPackageCredit ────────────────────────────────────────────────
console.log('\n[1] Calcolo credito pacchetti');
{
  const p10 = calcPackageCredit('10');
  assert(approxEqual(p10.total, 16.93), 'Pacchetto €10: totale = €16.93', `got ${p10.total}`);

  const p30 = calcPackageCredit('30');
  assert(approxEqual(p30.total, 49.80), 'Pacchetto €30: totale = €49.80', `got ${p30.total}`);

  const p50 = calcPackageCredit('50');
  assert(approxEqual(p50.total, 79.70), 'Pacchetto €50: totale = €79.70', `got ${p50.total}`);
}

// ─── TEST 2: Prima ricarica ───────────────────────────────────────────────────
console.log('\n[2] Prima ricarica');
{
  const user = new UserPricingState('test-user-1');
  const result = user.applyFirstRecharge('10', 1.50);

  assert(user.isPromoActive === true, 'isPromoActive = true dopo prima ricarica');
  assert(approxEqual(user.promoBalance, 16.93), 'promoBalance = €16.93', `got ${user.promoBalance}`);
  assert(result.displayRate === PROMO_RATE, `displayRate = €${PROMO_RATE}`, `got ${result.displayRate}`);

  // Non si può fare due volte
  try {
    user.applyFirstRecharge('30', 1.50);
    assert(false, 'Errore se si tenta seconda prima ricarica');
  } catch (e) {
    assert(true, 'Errore corretto se si tenta seconda prima ricarica');
  }
}

// ─── TEST 3: Addebito a tariffa promo ────────────────────────────────────────
console.log('\n[3] Addebito a tariffa promozionale');
{
  const user = new UserPricingState('test-user-2');
  user.applyFirstRecharge('10', 2.00);

  // 1 minuto (60 secondi) a €0.99 = €0.99
  const tick = user.billSeconds(60, 2.00);
  assert(approxEqual(tick.charged, 0.99), 'Addebito 1min promo = €0.99', `got ${tick.charged}`);
  assert(tick.isPromoActive === true, 'Promo ancora attiva');
  assert(tick.rateChanged === false, 'Tariffa non cambiata');
}

// ─── TEST 4: Transizione promo → tariffa piena (split billing) ───────────────
console.log('\n[4] Transizione promo → tariffa piena (split billing)');
{
  const user = new UserPricingState('test-user-3');
  user.applyFirstRecharge('10', 2.00); // credito promo = €16.93

  // Aggiungiamo €10 extra mentre la promo è ancora attiva:
  // totalBalance = 16.93 + 10 = 26.93, promoBalance resta 16.93
  user.applySubsequentRecharge(10.00);
  assert(approxEqual(user.totalBalance, 26.93), 'totalBalance = €26.93 dopo ricarica aggiuntiva', `got ${user.totalBalance}`);

  // Tick che esaurisce tutta la promo (~1026 sec) + 60 sec a tariffa piena
  const totalPromoSeconds = Math.floor((16.93 / PROMO_RATE) * 60); // ~1026 sec
  const extraSeconds = 60;

  const tick = user.billSeconds(totalPromoSeconds + extraSeconds, 2.00);

  assert(tick.rateChanged === true, 'rateChanged = true quando il credito promo si esaurisce');
  assert(user.isPromoActive === false, 'isPromoActive = false dopo esaurimento');
  assert(tick.newRate === 2.00, 'Nuova tariffa = €2.00/min', `got ${tick.newRate}`);
  assert(tick.previousRate === PROMO_RATE, `Tariffa precedente = €${PROMO_RATE}`, `got ${tick.previousRate}`);

  // Balance atteso: €10 extra - €2 (1 min @€2) = €8
  assert(approxEqual(tick.totalBalance, 8.00, 0.05),
    'Balance dopo transizione ≈ €8.00 (€10 extra - 1min @€2)',
    `got ${tick.totalBalance}`);
}

// ─── TEST 5: Ricarica successiva (tariffa piena) ──────────────────────────────
console.log('\n[5] Ricarica successiva');
{
  const user = new UserPricingState('test-user-4');
  user.applyFirstRecharge('10', 1.50);

  // Esaurisci il credito promo
  user.billSeconds(Math.ceil((16.93 / PROMO_RATE) * 60) + 10, 1.50);
  assert(user.isPromoActive === false, 'Promo esaurita prima della ricarica successiva');

  const balanceBefore = user.totalBalance;
  const recharge = user.applySubsequentRecharge(20.00);
  assert(approxEqual(recharge.totalBalance, balanceBefore + 20.00, 0.01),
    'Ricarica successiva aggiunge €20 al saldo', `got ${recharge.totalBalance}`);
  assert(recharge.displayRate === 1.50, 'displayRate rimane tariffa piena', `got ${recharge.displayRate}`);
}

// ─── TEST 6: Credito insufficiente ───────────────────────────────────────────
console.log('\n[6] Credito insufficiente');
{
  const user = new UserPricingState('test-user-5');
  user.applyFirstRecharge('10', 1.50);
  // Metti il saldo quasi a zero manualmente
  user.promoBalance = 0;
  user.totalBalance = 0;
  user.isPromoActive = false;

  try {
    user.billSeconds(60, 1.50);
    assert(false, 'Errore con credito zero');
  } catch (e) {
    assert(e.message === 'Credito insufficiente.', 'Errore corretto con credito zero');
  }
}

// ─── TEST 7: Tutti i pacchetti con varie tariffe consulente ──────────────────
console.log('\n[7] Scenario completo per ogni pacchetto');
{
  const scenarios = [
    { packageId: '10', consultantRate: 1.20, expectedPromoCredit: 16.93 },
    { packageId: '30', consultantRate: 2.50, expectedPromoCredit: 49.80 },
    { packageId: '50', consultantRate: 3.00, expectedPromoCredit: 79.70 },
  ];

  for (const sc of scenarios) {
    const user = new UserPricingState(`test-pkg-${sc.packageId}`);
    const result = user.applyFirstRecharge(sc.packageId, sc.consultantRate);

    assert(
      approxEqual(result.promoBalance, sc.expectedPromoCredit),
      `Pacchetto €${sc.packageId}: credito promo = €${sc.expectedPromoCredit}`,
      `got ${result.promoBalance}`
    );

    // displayRate deve sempre essere €0.99 durante la promo
    assert(
      result.displayRate === PROMO_RATE,
      `Pacchetto €${sc.packageId}: displayRate = €0.99 in promo`
    );
  }
}

// ─── RIEPILOGO ────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(50)}`);
console.log(`Risultati: ${passed} passati, ${failed} falliti`);
if (failed === 0) {
  console.log('🎉 Tutti i test superati!\n');
  process.exit(0);
} else {
  console.log('💥 Alcuni test falliti.\n');
  process.exit(1);
}
