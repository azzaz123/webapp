/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * User clicks on add or edit a bank account
 */
export interface ClickAddEditBankAccount {
  /**
   * Whether the click is on add or edit
   */
  addOrEdit: 'add' | 'edit';
  /**
   * Identifier of the transaction request
   */
  requestId?: string;
  /**
   * The unique identifier for an item
   */
  itemId?: string;
  /**
   * Identifier of the category that the item belongs to
   */
  categoryId?: number;
  /**
   * Item price without fees
   */
  itemPrice?: number;
  /**
   * Identifier of the screen where the click is done
   */
  screenId: 210 | 242;
  /**
   * Status of the KYC verification
   */
  kycStatus?: 'verified' | 'pending' | 'inProgress';
}
