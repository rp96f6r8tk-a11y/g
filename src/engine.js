'use strict';

const PROMO_RATE = 0.99; // €/minuto — tariffa promozionale prima ricarica

const PACKAGES = {
  '10': { amount: 10.00, bonusMinutes: 7,  label: '€10 + 7 minuti bonus' },
  '30': { amount: 30.00, bonusMinutes: 20, label: '€30 + 20 minuti bonus' },
  '50': { amount: 50.00, bonusMinutes: 30, label: '€50 + 30 minuti bonus' },
};

function round(n, decimals = 4) {
  return parseFloat(n.toFixed(decimals));
}

function calcPackageCredit(packageId) {
  const pkg = PACKAGES[packageId];
  if (!pkg) throw new Error(`Pacchetto non valido: ${packageId}`);
  const bonusCredit = round(pkg.bonusMinutes * PROMO_RATE);
  const total = round(pkg.amount + bonusCredit);
  return { ...pkg, bonusCredit, total };
}

class UserPricingState {
  constructor(userId) {
    this.userId = userId;

    // Stato prima ricarica
    this.isFirstRechargeDone = false;
    this.isPromoActive = false;
    this.promoBalance = 0;     // credito rimanente a tariffa promo (€)
    this.totalBalance = 0;     // credito totale rimanente (€)

    // Tariffa consulente corrente
    this.consultantRate = 0;

    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  _touch() {
    this.updatedAt = new Date().toISOString();
  }

  /**
   * Prima ricarica con 7 minuti di benvenuto inclusi.
   * packageId: '10' | '30' | '50'
   * consultantRate: tariffa del consulente in €/minuto
   */
  applyFirstRecharge(packageId, consultantRate) {
    if (this.isFirstRechargeDone) {
      throw new Error('Prima ricarica già effettuata.');
    }
    if (!consultantRate || consultantRate <= 0) {
      throw new Error('Tariffa consulente non valida.');
    }

    const pkg = calcPackageCredit(packageId);

    this.isFirstRechargeDone = true;
    this.isPromoActive = true;
    this.promoBalance = pkg.total;
    this.totalBalance = pkg.total;
    this.consultantRate = consultantRate;
    this._touch();

    return {
      package: pkg,
      promoBalance: this.promoBalance,
      totalBalance: this.totalBalance,
      displayRate: PROMO_RATE,
      message: `${pkg.label} | Credito promo: €${pkg.total.toFixed(2)} | Tariffa: €${PROMO_RATE}/min`,
    };
  }

  /**
   * Ricariche successive (dopo esaurimento prima ricarica) — tariffa piena del consulente.
   */
  applySubsequentRecharge(amount) {
    if (!this.isFirstRechargeDone) {
      throw new Error('Nessuna prima ricarica trovata. Usa applyFirstRecharge() prima.');
    }
    if (amount <= 0) throw new Error('Importo non valido.');

    this.totalBalance = round(this.totalBalance + amount);
    this._touch();

    return {
      added: amount,
      totalBalance: this.totalBalance,
      displayRate: this.isPromoActive ? PROMO_RATE : this.consultantRate,
      isPromoActive: this.isPromoActive,
    };
  }

  /**
   * Addebita i secondi di sessione.
   * Gestisce automaticamente la transizione promo → tariffa piena nel mezzo di un tick.
   *
   * Returns: { charged, rateChanged, previousRate, newRate, promoBalance, totalBalance, displayRate }
   */
  billSeconds(seconds, consultantRate) {
    if (seconds <= 0) throw new Error('Secondi non validi.');
    if (this.totalBalance <= 0) throw new Error('Credito insufficiente.');

    this.consultantRate = consultantRate || this.consultantRate;

    let charged = 0;
    let rateChanged = false;
    const previousRate = this.isPromoActive ? PROMO_RATE : this.consultantRate;
    const minutesFraction = seconds / 60;

    if (this.isPromoActive) {
      const promoCost = round(minutesFraction * PROMO_RATE, 6);

      if (this.promoBalance >= promoCost) {
        // Tutto a tariffa promo
        this.promoBalance = round(this.promoBalance - promoCost, 6);
        this.totalBalance = round(this.totalBalance - promoCost, 6);
        charged = promoCost;

        // Tolleranza floating point: se il saldo promo è esaurito
        if (this.promoBalance < 0.0001) {
          this.promoBalance = 0;
          this.isPromoActive = false;
          rateChanged = true;
        }
      } else {
        // Il credito promo si esaurisce a metà del tick: split billing
        const promoSecondsLeft = (this.promoBalance / PROMO_RATE) * 60;
        const fullRateSeconds = seconds - promoSecondsLeft;

        const promoCharged = this.promoBalance;
        const fullCharged = round((fullRateSeconds / 60) * this.consultantRate, 6);

        charged = round(promoCharged + fullCharged, 6);
        this.promoBalance = 0;
        this.totalBalance = round(this.totalBalance - charged, 6);
        this.isPromoActive = false;
        rateChanged = true;
      }
    } else {
      // Tariffa piena
      const fullCost = round(minutesFraction * this.consultantRate, 6);
      this.totalBalance = round(this.totalBalance - fullCost, 6);
      charged = fullCost;
    }

    if (this.totalBalance < 0) this.totalBalance = 0;
    this._touch();

    const newRate = this.isPromoActive ? PROMO_RATE : this.consultantRate;

    return {
      charged: round(charged),
      rateChanged,
      previousRate,
      newRate,
      promoBalance: Math.max(0, round(this.promoBalance)),
      totalBalance: Math.max(0, round(this.totalBalance)),
      displayRate: newRate,
      isPromoActive: this.isPromoActive,
    };
  }

  getState() {
    return {
      userId: this.userId,
      isFirstRechargeDone: this.isFirstRechargeDone,
      isPromoActive: this.isPromoActive,
      promoBalance: Math.max(0, round(this.promoBalance)),
      totalBalance: Math.max(0, round(this.totalBalance)),
      displayRate: this.isPromoActive ? PROMO_RATE : this.consultantRate,
      consultantRate: this.consultantRate,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = { UserPricingState, PACKAGES, PROMO_RATE, calcPackageCredit };
