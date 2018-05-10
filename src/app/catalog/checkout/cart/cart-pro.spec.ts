import { CartPro } from './cart-pro';
import { MOCK_PROITEM, MOCK_PROITEM2, CART_ORDER_PRO } from '../../../../tests/pro-item.fixtures.spec';
import { CartBase } from './cart-base';
import { OrderPro } from '../../../core/item/item-response.interface';
import { MOCK_SELECTED_DATES, MOCK_DATE } from '../../../../tests/calendar.fixtures.spec';

describe('CartPro', () => {

  let cart: CartPro;

  beforeEach(() => {
    cart = new CartPro();
    cart.add(MOCK_PROITEM, 'citybump');
    cart.add(MOCK_PROITEM2, 'countrybump');
  });

  it('should create an instance of CartPro', () => {
    expect(new CartPro() instanceof CartBase).toBe(true);
  });

  describe('add', () => {
    it('should add cartItems to array', () => {
      expect(cart.citybump.cartItems[0]).toEqual(MOCK_PROITEM);
      expect(cart.countrybump.cartItems[0]).toEqual(MOCK_PROITEM2);
      expect(cart.citybump.cartItems.length).toBe(1);
      expect(cart.countrybump.cartItems.length).toBe(1);
    });

    it('should calculate totals', () => {
      expect(cart.citybump.total).toBe(+MOCK_PROITEM.selectedDates.numberOfDays);
      expect(cart.countrybump.total).toBe(+MOCK_PROITEM2.selectedDates.numberOfDays);
      expect(cart.total).toBe(cart.citybump.total + cart.countrybump.total);
    });

    it('should calculate totals if there is more than one item with same bump', () => {
      cart.add(MOCK_PROITEM2, 'citybump');

      expect(cart.citybump.total).toBe(+MOCK_PROITEM.selectedDates.numberOfDays + MOCK_PROITEM2.selectedDates.numberOfDays);
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
      expect(cart.countrybump.total).toBe(+MOCK_PROITEM2.selectedDates.numberOfDays);
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
      spyOn(cart, 'prepareDate').and.callThrough();

      result = cart.prepareDate(MOCK_PROITEM.selectedDates.fromDate);

      expect(result).toBe(CART_ORDER_PRO[0].start_date);
    });
  });

  describe('prepareBumpType', () => {
    beforeEach(() => {
      spyOn(cart, 'prepareBumpType').and.callThrough();
    });

    it('should return true if bumpType is countrybump', () => {
      const result = cart.prepareBumpType('countrybump');

      expect(result).toBe(true);
    });

    it('should return false if bumpType is citybump', () => {
      const result = cart.prepareBumpType('citybump');

      expect(result).toBe(false);
    });
  });

});
