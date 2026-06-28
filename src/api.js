'use strict';

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { UserPricingState, PACKAGES, PROMO_RATE } = require('./engine');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../'));

// ─── Store in-memory (sostituire con DB in produzione) ────────────────────────
const users = new Map();     // userId → UserPricingState
const sessions = new Map();  // sessionId → SessionData

function getUser(userId) {
  if (!users.has(userId)) throw Object.assign(new Error('Utente non trovato.'), { status: 404 });
  return users.get(userId);
}

// ─── Helper ───────────────────────────────────────────────────────────────────
function ok(res, data) { res.json({ success: true, ...data }); }
function err(res, status, message) { res.status(status).json({ success: false, error: message }); }

function handle(fn) {
  return async (req, res) => {
    try { await fn(req, res); }
    catch (e) { err(res, e.status || 400, e.message); }
  };
}

// ─── UTENTI ──────────────────────────────────────────────────────────────────

// POST /api/users  — crea utente
app.post('/api/users', handle((req, res) => {
  const userId = req.body.userId || uuidv4();
  if (users.has(userId)) return err(res, 409, 'Utente già esistente.');
  users.set(userId, new UserPricingState(userId));
  ok(res, { userId, state: users.get(userId).getState() });
}));

// GET /api/users/:userId  — stato utente
app.get('/api/users/:userId', handle((req, res) => {
  const user = getUser(req.params.userId);
  ok(res, { state: user.getState() });
}));

// POST /api/users/:userId/first-recharge  — prima ricarica
// Body: { packageId: '10'|'30'|'50', consultantRate: number }
app.post('/api/users/:userId/first-recharge', handle((req, res) => {
  const { packageId, consultantRate } = req.body;
  if (!packageId || !consultantRate) return err(res, 400, 'packageId e consultantRate obbligatori.');
  const user = getUser(req.params.userId);
  const result = user.applyFirstRecharge(packageId, parseFloat(consultantRate));
  ok(res, { result, state: user.getState() });
}));

// POST /api/users/:userId/recharge  — ricarica successiva
// Body: { amount: number }
app.post('/api/users/:userId/recharge', handle((req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) return err(res, 400, 'Importo non valido.');
  const user = getUser(req.params.userId);
  const result = user.applySubsequentRecharge(parseFloat(amount));
  ok(res, { result, state: user.getState() });
}));

// ─── SESSIONI ────────────────────────────────────────────────────────────────

// POST /api/sessions/start  — avvia sessione
// Body: { userId, consultantId, consultantRate }
app.post('/api/sessions/start', handle((req, res) => {
  const { userId, consultantId, consultantRate } = req.body;
  if (!userId || !consultantId || !consultantRate) {
    return err(res, 400, 'userId, consultantId e consultantRate obbligatori.');
  }
  const user = getUser(userId);
  if (user.totalBalance <= 0) return err(res, 402, 'Credito insufficiente.');

  const sessionId = uuidv4();
  const sessionState = user.getState();

  sessions.set(sessionId, {
    sessionId,
    userId,
    consultantId,
    consultantRate: parseFloat(consultantRate),
    startedAt: new Date().toISOString(),
    endedAt: null,
    totalSeconds: 0,
    totalCharged: 0,
    rateChangedAt: null,
    active: true,
  });

  ok(res, {
    sessionId,
    displayRate: sessionState.displayRate,
    isPromoActive: sessionState.isPromoActive,
    balance: sessionState.totalBalance,
    message: sessionState.isPromoActive
      ? `Sessione avviata a tariffa promozionale €${PROMO_RATE}/min`
      : `Sessione avviata a tariffa consulente €${consultantRate}/min`,
  });
}));

// POST /api/sessions/:sessionId/bill  — addebita secondi
// Body: { seconds: number }
app.post('/api/sessions/:sessionId/bill', handle((req, res) => {
  const { seconds } = req.body;
  if (!seconds || seconds <= 0) return err(res, 400, 'Secondi non validi.');

  const session = sessions.get(req.params.sessionId);
  if (!session) return err(res, 404, 'Sessione non trovata.');
  if (!session.active) return err(res, 400, 'Sessione già terminata.');

  const user = getUser(session.userId);
  const billing = user.billSeconds(parseInt(seconds), session.consultantRate);

  session.totalSeconds += parseInt(seconds);
  session.totalCharged = round4(session.totalCharged + billing.charged);

  if (billing.rateChanged && !session.rateChangedAt) {
    session.rateChangedAt = new Date().toISOString();
  }

  ok(res, {
    billing,
    session: {
      sessionId: session.sessionId,
      totalSeconds: session.totalSeconds,
      totalCharged: session.totalCharged,
    },
    state: user.getState(),
  });
}));

// POST /api/sessions/:sessionId/end  — termina sessione
app.post('/api/sessions/:sessionId/end', handle((req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return err(res, 404, 'Sessione non trovata.');
  if (!session.active) return err(res, 400, 'Sessione già terminata.');

  session.active = false;
  session.endedAt = new Date().toISOString();

  const user = getUser(session.userId);

  ok(res, {
    summary: {
      sessionId: session.sessionId,
      durationSeconds: session.totalSeconds,
      durationFormatted: formatDuration(session.totalSeconds),
      totalCharged: session.totalCharged,
      rateChangedAt: session.rateChangedAt,
      startedAt: session.startedAt,
      endedAt: session.endedAt,
    },
    state: user.getState(),
  });
}));

// GET /api/sessions/:sessionId  — info sessione
app.get('/api/sessions/:sessionId', handle((req, res) => {
  const session = sessions.get(req.params.sessionId);
  if (!session) return err(res, 404, 'Sessione non trovata.');
  ok(res, { session });
}));

// ─── INFO PACCHETTI ──────────────────────────────────────────────────────────
app.get('/api/packages', (req, res) => {
  const result = Object.entries(PACKAGES).map(([id, pkg]) => ({
    id,
    label: pkg.label,
    amount: pkg.amount,
    bonusMinutes: pkg.bonusMinutes,
    bonusCredit: round4(pkg.bonusMinutes * PROMO_RATE),
    totalCredit: round4(pkg.amount + pkg.bonusMinutes * PROMO_RATE),
    promoRate: PROMO_RATE,
  }));
  res.json({ success: true, packages: result, promoRate: PROMO_RATE });
});

// ─── Utility ─────────────────────────────────────────────────────────────────
function round4(n) { return parseFloat(n.toFixed(4)); }
function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🔮 Tarot Pricing API avviata su http://localhost:${PORT}`);
  console.log(`📊 Simulatore: http://localhost:${PORT}/simulator.html\n`);
});

module.exports = app;
