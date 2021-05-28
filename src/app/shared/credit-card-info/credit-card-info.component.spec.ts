import { ComponentFixture, fakeAsync, tick, TestBed, waitForAsync } from '@angular/core/testing';
import { CreditCardInfoComponent } from './credit-card-info.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CreditCardInfoComponent', () => {
  const VISA_SRC_PATH = '/assets/icons/card-visa.svg';
  const MASTERCARD_SRC_PATH = '/assets/icons/card-mastercard.svg';
  const GENERIC_CARD_SRC_PATH = '/assets/icons/card.svg';

  let component: CreditCardInfoComponent;
  let fixture: ComponentFixture<CreditCardInfoComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [CreditCardInfoComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('when clicking in change card button...', () => {
    beforeEach(() => {
      component.canChangeCard = true;

      fixture.detectChanges();
    });

    it('should emit the changeCardClick event', fakeAsync(() => {
      spyOn(component.changeCardClick, 'emit');

      fixture.debugElement.nativeElement.querySelector('.CreditCard__info--actions-change').click();
      tick();

      expect(component.changeCardClick.emit).toHaveBeenCalled();
    }));
  });

  describe('when clicking in delete card button...', () => {
    it('should emit the deleteCardClick event', fakeAsync(() => {
      spyOn(component.deleteCardClick, 'emit');

      fixture.debugElement.nativeElement.querySelector('.CreditCard__info--actions-delete').click();
      tick();

      expect(component.deleteCardClick.emit).toHaveBeenCalled();
    }));
  });

  describe('when the credit card brand is mastercard...', () => {
    it('the credit card src path should be a mastercard svg', () => {
      component.brand = 'mastercard';

      component.ngOnInit();

      expect(component.creditCardBrandSrc).toStrictEqual(MASTERCARD_SRC_PATH);
    });
  });

  describe('when the credit card brand is visa...', () => {
    it('the credit card src path should be a mastercard svg', () => {
      component.brand = 'visa';

      component.ngOnInit();

      expect(component.creditCardBrandSrc).toStrictEqual(VISA_SRC_PATH);
    });
  });

  describe('when the credit card brand is not mastercard or visa...', () => {
    it('the credit card src path should be a generic card svg', () => {
      component.brand = 'blablabla';

      component.ngOnInit();

      expect(component.creditCardBrandSrc).toStrictEqual(GENERIC_CARD_SRC_PATH);
    });
  });
});
