import { pluginRegistry, OrderDiscountAdapter } from '@unchainedshop/core';

type Coupon = {
  code: string;
  // Which pricing plugin applies the effect, and its config.
  pricingAdapterKey: string;
  config: Record<string, number>;
};

// A manual (code-triggered) order-discount adapter for a single coupon code,
// modelled on the built-in order-discount adapter.
const makeAdapter = (key: string, { code, pricingAdapterKey, config }: Coupon) => ({
  ...OrderDiscountAdapter,
  key,
  label: `Coupon ${code}`,
  version: '1.0.0',
  orderIndex: 20,
  isManualAdditionAllowed: async () => true,
  isManualRemovalAllowed: async () => true,
  actions: async ({ context }: any) => ({
    ...(await OrderDiscountAdapter.actions({ context })),
    isValidForSystemTriggering: async () => false,
    isValidForCodeTriggering: async ({ code: entered }: { code: string }) =>
      entered?.toUpperCase() === code,
    discountForPricingAdapterKey: ({
      pricingAdapterKey: asked,
    }: {
      pricingAdapterKey: string;
    }) => (asked === pricingAdapterKey ? config : null),
  }),
});

const COUPONS: Record<string, Coupon> = {
  // 10% off the cart
  'shop.unchained.discount.welcome10': {
    code: 'WELCOME10',
    pricingAdapterKey: 'shop.unchained.pricing.product-discount',
    config: { rate: 0.1 },
  },
  // CHF 10.00 off the order total
  'shop.unchained.discount.tenoff': {
    code: '10OFF',
    pricingAdapterKey: 'shop.unchained.pricing.order-discount',
    config: { fixedRate: 1000 },
  },
};

pluginRegistry.register({
  key: 'shop.unchained.discount.coupons',
  label: 'Coupon Codes',
  version: '1.0.0',
  adapters: Object.entries(COUPONS).map(([key, coupon]) => makeAdapter(key, coupon)),
});
