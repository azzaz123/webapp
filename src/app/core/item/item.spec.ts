/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { Item, ITEM_BASE_PATH } from './item';
import {
  ITEM_ACTIONS_ALLOWED,
  ITEM_CATEGORY_ID,
  ITEM_CURRENCY_CODE,
  ITEM_DESCRIPTION,
  ITEM_FLAGS,
  ITEM_ID,
  ITEM_IMAGES,
  ITEM_LEGACY_ID,
  ITEM_LOCATION,
  ITEM_MAIN_IMAGE,
  ITEM_MODIFIED_DATE,
  ITEM_PUBLISHED_DATE,
  ITEM_SALE_CONDITIONS,
  ITEM_SALE_PRICE,
  ITEM_TITLE,
  ITEM_URL,
  ITEM_WEB_SLUG,
  MOCK_ITEM,
} from '../../../tests/item.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';

describe('Item', () => {
  let item: Item;

  beforeEach(() => {
    item = MOCK_ITEM;
  });

  it('should create an instance', () => {
    expect(item).toBeTruthy();
  });

  it('should set the user data through the constructor', () => {
    expect(item.id).toBe(ITEM_ID);
    expect(item.legacyId).toBe(ITEM_LEGACY_ID);
    expect(item.title).toBe(ITEM_TITLE);
    expect(item.description).toBe(ITEM_DESCRIPTION);
    expect(item.categoryId).toBe(ITEM_CATEGORY_ID);
    expect(item.location).toBe(ITEM_LOCATION);
    expect(item.salePrice).toBe(ITEM_SALE_PRICE);
    expect(item.currencyCode).toBe(ITEM_CURRENCY_CODE);
    expect(item.modifiedDate).toBe(ITEM_MODIFIED_DATE);
    expect(item.url).toBe(ITEM_URL);
    expect(item.flags).toBe(ITEM_FLAGS);
    expect(item.actionsAllowed).toBe(ITEM_ACTIONS_ALLOWED);
    expect(item.saleConditions).toBe(ITEM_SALE_CONDITIONS);
    expect(item.mainImage).toBe(ITEM_MAIN_IMAGE);
    expect(item.images).toBe(ITEM_IMAGES);
    expect(item.webLink).toBe(ITEM_BASE_PATH + ITEM_WEB_SLUG);
    expect(item.publishedDate).toBe(ITEM_PUBLISHED_DATE);
  });

  it('should set sold', () => {
    item.sold = true;
    expect(item.flags.sold).toBeTruthy();
    item.sold = false;
    expect(item.flags.sold).toBeFalsy();
  });

  it('should get sold', () => {
    item.flags.sold = true;
    expect(item.sold).toBeTruthy();
    item.flags.sold = false;
    expect(item.sold).toBeFalsy();
    const item2: Item = new Item('1', 1, USER_ID);
    expect(item2.sold).toBeFalsy();
  });

  it('should set reserved', () => {
    item.reserved = true;
    expect(item.flags.reserved).toBeTruthy();
    item.reserved = false;
    expect(item.flags.reserved).toBeFalsy();
  });

  it('should get reserved', () => {
    item.flags.reserved = true;
    expect(item.reserved).toBeTruthy();
    item.flags.reserved = false;
    expect(item.reserved).toBeFalsy();
    const item2: Item = new Item('1', 1, USER_ID);
    expect(item2.reserved).toBeFalsy();
  });

  it('should set and get selected', () => {
    item.selected = true;
    expect(item.selected).toBeTruthy();
    item.selected = false;
    expect(item.selected).toBeFalsy();
  });
});
