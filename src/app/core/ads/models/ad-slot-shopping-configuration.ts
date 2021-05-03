export interface AdSlotShoppingBaseConfiguration {
  container: string;
}

export interface AdSlotGroupShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  slotId: string;
  width: number;
  height: number;
}

export interface AdSlotShoppingConfiguration extends AdSlotShoppingBaseConfiguration {
  styleId: string;
  linkTarget: string;
}
