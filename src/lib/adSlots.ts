export const AD_SLOTS = ["none", "homepage", "featured", "nearby"] as const;
export type AdSlot = typeof AD_SLOTS[number];