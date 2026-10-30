// ─────────────────────────────────────────────────────────────
// BLACK NOVEMBER 2026 — campaign settings
// Edit the dates or percentages here; every price on the site
// (cards, product pages, quick view, cart, WhatsApp order) follows.
// All times are Nairobi time (EAT, UTC+3).
// ─────────────────────────────────────────────────────────────

export const CAMPAIGN = {
  name: 'Black November',
  start: '2026-11-01T00:00:00+03:00',
  // Black Friday weekend: deeper discounts
  weekendStart: '2026-11-27T00:00:00+03:00',
  end: '2026-11-30T23:59:59+03:00',

  // Percent off the RRP, by phase and product group
  discounts: {
    november: { hairCare: 15, appliances: 10 },
    weekend: { hairCare: 25, appliances: 15 },
  },
};

const HAIR_CARE = ['shampoo-conditioner', 'treatments', 'styling'];

const t = (iso) => new Date(iso).getTime();

/** 'before' | 'november' | 'weekend' | 'ended' — or null when the time is unknown (server render) */
export function campaignPhase(now) {
  if (now == null) return null;
  if (now < t(CAMPAIGN.start)) return 'before';
  if (now > t(CAMPAIGN.end)) return 'ended';
  if (now >= t(CAMPAIGN.weekendStart)) return 'weekend';
  return 'november';
}

/** The next moment worth counting down to, with a label. */
export function campaignCountdown(now) {
  const phase = campaignPhase(now);
  if (phase === 'before') return { label: 'Black November starts in', target: t(CAMPAIGN.start) };
  if (phase === 'november') return { label: 'Black Friday Weekend starts in', target: t(CAMPAIGN.weekendStart) };
  if (phase === 'weekend') return { label: 'Black Friday Weekend ends in', target: t(CAMPAIGN.end) };
  return null;
}

export function isComingSoon(product) {
  return product?.comingSoon === true;
}

/** Percent off for a product right now (0 when no deal applies). */
export function dealPercent(product, now) {
  const phase = campaignPhase(now);
  if (phase !== 'november' && phase !== 'weekend') return 0;
  if (!product || isComingSoon(product) || product.inStock === false) return 0;
  const group = HAIR_CARE.includes(product.category) ? 'hairCare' : product.category === 'appliances' ? 'appliances' : null;
  if (!group) return 0;
  return CAMPAIGN.discounts[phase][group] || 0;
}

/** Deal price: whole shillings under KSh 500, nearest KSh 5 above (keeps the advertised % honest). */
export function dealPrice(price, percent) {
  if (!percent) return price;
  const raw = (price * (100 - percent)) / 100;
  return price < 500 ? Math.round(raw) : Math.round(raw / 5) * 5;
}

/** Best (highest) percent advertised for the current or upcoming phase — for banners. */
export function headlinePercents(now) {
  const phase = campaignPhase(now);
  const d = CAMPAIGN.discounts;
  if (phase === 'weekend') return d.weekend;
  return d.november;
}

export function formatKsh(num) {
  return 'KSh ' + Number(num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
