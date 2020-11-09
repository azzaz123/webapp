import { CartPro } from './cart-pro';
import {
  MOCK_PROITEM,
  MOCK_PROITEM2,
} from '../../../../tests/pro-item.fixtures.spec';
import { CartBase } from './cart-base';

describe('CartPro', () => {
  let cart: CartPro;

  beforeEach(() => {
    cart = new CartPro();
    cart.add(MOCK_PROITEM, 'citybump');
    cart.add(MOCK_PROITEM2, 'countrybump');
  });

  it('should create an instance of CartPro', () => {
    expect(cart instanceof CartPro).toBe(true);
  });

  describe('add', () => {
    it('should add cartItems to array', () => {
      expect(cart.citybump.cartItems[0]).toEqual(MOCK_PROITEM);
      expect(cart.countrybump.cartItems[0]).toEqual(MOCK_PROITEM2);
      expect(cart.citybump.cartItems.length).toBe(1);
      expect(cart.countrybump.cartItems.length).toBe(1);
    });

    it('should calculate totals', () => {
      expect(cart.citybump.total).toBe(
        +MOCK_PROITEM.selectedDates.numberOfDays
      );
      expect(cart.countrybump.total).toBe(
        +MOCK_PROITEM2.selectedDates.numberOfDays
      );
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });

    it('should calculate totals if there is more than one item with same bump', () => {
      cart.add(MOCK_PROITEM2, 'citybump');

      expect(cart.citybump.total).toBe(
        +MOCK_PROITEM.selectedDates.numberOfDays +
          MOCK_PROITEM2.selectedDates.numberOfDays
      );
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });

    it('should move item from country to city', () => {
      cart.add(MOCK_PROITEM2, 'citybump');

      expect(cart.citybump.cartItems[1]).toEqual(MOCK_PROITEM2);
      expect(cart.citybump.cartItems.length).toBe(2);
      expect(cart.countrybump.cartItems.length).toBe(0);
    });
  });

  describe('removeCartItem', () => {
    it('should remove item and update total', () => {
      cart.removeCartItem(MOCK_PROITEM.item.id, 'citybump');

      expect(cart.citybump.cartItems.length).toBe(0);
      expect(cart.countrybump.cartItems.length).toBe(1);
      expect(cart.countrybump.cartItems[0]).toEqual(MOCK_PROITEM2);
      expect(cart.countrybump.total).toBe(
        +MOCK_PROITEM2.selectedDates.numberOfDays
      );
      expect(cart.citybump.total).toBe(0);
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });
  });

  describe('clean', () => {
    it('should remove all items and reset total', () => {
      cart.clean();

      expect(cart.citybump.cartItems.length).toBe(0);
      expect(cart.countrybump.cartItems.length).toBe(0);
      expect(cart.total).toBe(0);
    });
  });

  describe('prepareDate', () => {
    it('should transform start and end date to milliseconds', () => {
      let result: number;
      const dates = MOCK_PROITEM.selectedDates.fromDate;
      spyOn(cart, 'prepareDate').and.callThrough();

      result = cart.prepareDate(dates);

      expect(result).toBe(
        new Date(dates.year, dates.month - 1, dates.day).getTime()
      );
    });
  });

  describe('isCountryBump', () => {
    beforeEach(() => {
      spyOn(cart, 'isCountryBump').and.callThrough();
    });

    it('should return true if bumpType is countrybump', () => {
      const result = cart.isCountryBump('countrybump');

      expect(result).toBe(true);
    });

    it('should return false if bumpType is citybump', () => {
      const result = cart.isCountryBump('citybump');

      expect(result).toBe(false);
    });
  });
});
