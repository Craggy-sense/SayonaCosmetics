// ─────────────────────────────────────────────────────────────
// DELIVERY FEES (KSh) — edit here; the cart, WhatsApp order and
// Delivery & Returns page all follow.
// ─────────────────────────────────────────────────────────────

export const FREE_DELIVERY_FROM = 3000; // Nairobi orders at or above this are free

export const DELIVERY_ZONES = [
  {
    id: 'nairobi',
    label: 'Nairobi',
    note: 'Same or next working day',
    fee: 200,
    freeFrom: FREE_DELIVERY_FROM,
  },
  {
    id: 'environs',
    label: 'Nairobi environs',
    note: 'Ruaka, Kitengela, Rongai, Syokimau, Ruiru, Kikuyu…',
    fee: 350,
    freeFrom: null,
  },
  {
    id: 'upcountry',
    label: 'Rest of Kenya (courier)',
    note: '1–3 working days, collect at courier office',
    fee: 450,
    freeFrom: null,
  },
];

export function deliveryFor(zoneId, subtotal) {
  const zone = DELIVERY_ZONES.find((z) => z.id === zoneId) || DELIVERY_ZONES[0];
  const free = zone.freeFrom != null && subtotal >= zone.freeFrom;
  return { zone, fee: free ? 0 : zone.fee, free };
}
