/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on the 'Buy' button to pay for a transaction (this sends a shipping request if there is no error)
 */
export interface PayTransaction {
  /**
   * The unique identifier for an item
   */
  itemId: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId: number;
  /**
   * The unique identifier of the search that the click on the pay transaction button is under
   */
  searchId?: string;
  /**
   * Identifier of the screen that the item was clicked from
   */
  screenId: 238 | 313;
  /**
   * Identifier of the user that the item belongs to
   */
  sellerUserId: string;
  /**
   * Item price without fees
   */
  itemPrice: number;
  /**
   * Delivery and insurance fees
   */
  feesPrice?: number;
  /**
   * If the item is a bumped item
   */
  isBumped?: boolean;
  /**
   * If the item is from a professional user
   */
  isPro?: boolean;
  /**
   * Balance amount in the wallet
   */
  walletBalanceAmount: number;
  /**
   * Payment method the user has selected
   */
  paymentMethod?: 'bank card' | 'wallet' | 'wallet, bank card' | 'paypal' | 'wallet, paypal';
  /**
   * Delivery method the user has selected
   */
  deliveryMethod?: 'buyer address' | 'carrier office';
  /**
   * Promocode used
   */
  isPromoApplied?: boolean;
  /**
   * Test group of the user
   */
  experiment?: 'payments_3dspopup_control' | 'payments_3dspopup_variant';
}
