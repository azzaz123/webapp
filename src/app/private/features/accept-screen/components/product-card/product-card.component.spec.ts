import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  MOCK_ACCEPT_SCREEN_BUYER,
  MOCK_ACCEPT_SCREEN_ITEM,
} from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';

import { ProductCardComponent } from './product-card.component';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  let de: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    de = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when showing product card', () => {
    describe('and we have buyer and item', () => {
      beforeEach(() => {
        component.buyer = MOCK_ACCEPT_SCREEN_BUYER;
        component.item = MOCK_ACCEPT_SCREEN_ITEM;
        fixture.detectChanges();
      });

      it('should show buyer avatar', () => {
        const buyerAvatar: DebugElement = de.query(By.css('tsl-user-avatar'));

        expect(buyerAvatar).toBeTruthy();
        expect(buyerAvatar.nativeElement.imageUrl).toStrictEqual(MOCK_ACCEPT_SCREEN_BUYER.imageUrl);
      });

      it('should show buyer name', () => {
        const buyerName: string = de.query(By.css('#BuyerName')).nativeElement.innerHTML;

        expect(buyerName).toStrictEqual(MOCK_ACCEPT_SCREEN_BUYER.name);
      });

      it('should show item image', () => {
        expect(de.nativeElement.querySelector(`[src*="${component.item.imageUrl}"]`)).toBeTruthy();
      });

      it('should show item title', () => {
        const itemTitle: string = de.query(By.css('.ProductCard__text')).nativeElement.innerHTML;

        expect(itemTitle).toStrictEqual(MOCK_ACCEPT_SCREEN_ITEM.title);
      });

      it('should show item price', () => {
        const itemPrice: string = de.query(By.css('.ProductCard__itemPriceWrapper__price')).nativeElement.innerHTML;
        const expectedItemPrice: string = `${MOCK_ACCEPT_SCREEN_ITEM.price.amount.total}${MOCK_ACCEPT_SCREEN_ITEM.price.currency.symbol}`;

        expect(itemPrice).toStrictEqual(expectedItemPrice);
      });
    });

    describe('and we DONT have buyer and item', () => {
      beforeEach(() => {
        component.buyer = null;
        component.item = null;

        fixture.detectChanges();
      });

      it('should not show buyer specifications', () => {
        expect(de.nativeElement.querySelector('.ProductCard__buyerWrapper')).toBeFalsy();
      });

      it('should not show item specifications', () => {
        expect(de.nativeElement.querySelector('#itemWrapper')).toBeFalsy();
      });
    });
  });
});
