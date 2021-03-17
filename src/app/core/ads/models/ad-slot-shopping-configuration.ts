export interface AdSlotShoppingBaseConfiguration {
  container: string;
}

export interface AdSlotShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  width: number;
  height: number;
}

export interface AdSlotNativeShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  styleId: string;
  linkTarget: string;
}
