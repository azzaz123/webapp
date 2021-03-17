export interface AdSlotShoppingBaseConfiguration {
  container: string;
}

export interface AdSlotShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  slotId: string;
  width: number;
  height: number;
}

export interface AdSlotNativeShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  styleId: string;
  linkTarget: string;
}
