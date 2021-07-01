import { ComponentFixture, fakeAsync, tick, TestBed, waitForAsync } from '@angular/core/testing';
import { PaymentsCardInfoComponent } from './payments-card-info.component';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { BRAND_CARDS } from './payments-card-info.enum';
import { By } from '@angular/platform-browser';

describe('PaymentsCardInfoComponent', () => {
  const VISA_SRC_PATH = '/assets/icons/card-visa.svg';
  const MASTERCARD_SRC_PATH = '/assets/icons/card-mastercard.svg';
  const GENERIC_CARD_SRC_PATH = '/assets/icons/card.svg';
  const changeCardButtonSelector = '.PaymentsCardInfo__actions--change';
  const deleteCardButtonSelector = '.PaymentsCardInfo__actions--delete';
  const errorStyleSelector = '.PaymentsCardInfo--error';
  const numberCardSelector = '.PaymentsCardInfo__number';
  const svgSelector = 'tsl-svg-icon';

  let component: PaymentsCardInfoComponent;
  let fixture: ComponentFixture<PaymentsCardInfoComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [PaymentsCardInfoComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsCardInfoComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  describe('when hideEdit is true', () => {
    it('should not render the edit buttton', () => {
      component.hideEdit = true;

      fixture.detectChanges();

      expect(el.querySelector(changeCardButtonSelector)).toBeNull();
    });
  });

  describe('when hideEdit is false', () => {
    it('should render the edit buttton', () => {
      component.hideEdit = false;

      fixture.detectChanges();

      expect(el.querySelector(changeCardButtonSelector)).not.toBeNull();
    });
  });

  describe('when hideDelete is true', () => {
    it('should not render the delete buttton', () => {
      component.hideDelete = true;

      fixture.detectChanges();

      expect(el.querySelector(deleteCardButtonSelector)).toBeNull();
    });
  });

  describe('when hideDelete is false', () => {
    it('should render the delete buttton', () => {
      component.hideDelete = false;

      fixture.detectChanges();

      expect(el.querySelector(deleteCardButtonSelector)).not.toBeNull();
    });
  });

  describe('when the card has errors...', () => {
    it('should apply the error style', () => {
      component.error = true;

      fixture.detectChanges();

      expect(el.querySelector(errorStyleSelector)).not.toBeNull();
    });
  });

  describe(`when the card don't has errors...`, () => {
    it('should NOT apply the error style', () => {
      component.error = false;

      fixture.detectChanges();

      expect(el.querySelector(errorStyleSelector)).toBeNull();
    });
  });

  describe('when clicking in change card button...', () => {
    it('should emit the changeCardClick event', fakeAsync(() => {
      spyOn(component.changeCardClick, 'emit');

      fixture.debugElement.nativeElement.querySelector(changeCardButtonSelector).click();
      tick();

      expect(component.changeCardClick.emit).toHaveBeenCalled();
    }));
  });

  describe('when clicking in delete card button...', () => {
    it('should emit the deleteCardClick event', fakeAsync(() => {
      spyOn(component.deleteCardClick, 'emit');

      fixture.debugElement.nativeElement.querySelector(deleteCardButtonSelector).click();
      tick();

      expect(component.deleteCardClick.emit).toHaveBeenCalled();
    }));
  });

  describe('when the credit card brand is mastercard...', () => {
    it('the credit card src path should be a mastercard svg', () => {
      component.brand = BRAND_CARDS.MASTERCARD;

      component.ngOnChanges();

      expect(component.creditCardBrandSrc).toStrictEqual(MASTERCARD_SRC_PATH);
    });

    it('should show the svg', () => {
      expect(fixture.debugElement.query(By.css(svgSelector))).toBeTruthy();
    });
  });

  describe('when the credit card brand is visa...', () => {
    it('the credit card src path should be a mastercard svg', () => {
      component.brand = BRAND_CARDS.VISA;

      component.ngOnChanges();

      expect(component.creditCardBrandSrc).toStrictEqual(VISA_SRC_PATH);
    });

    it('should show the svg', () => {
      expect(fixture.debugElement.query(By.css(svgSelector))).toBeTruthy();
    });
  });

  describe('when the credit card brand is not mastercard or visa...', () => {
    it('the credit card src path should be a generic card svg', () => {
      component.brand = 'blablabla';

      component.ngOnChanges();

      expect(component.creditCardBrandSrc).toStrictEqual(GENERIC_CARD_SRC_PATH);
    });

    it('should show the svg', () => {
      expect(fixture.debugElement.query(By.css(svgSelector))).toBeTruthy();
    });
  });

  describe('when the entity is a bank account...', () => {
    beforeEach(() => {
      component.isBankAccount = true;
      component.numberCard = '1234';

      component.ngOnChanges();
      fixture.detectChanges();
    });

    it('should show only 4 stars before the number', () => {
      const fourStars = '****';

      expect(el.querySelector(numberCardSelector).innerHTML).toBe(`${fourStars} ${component.numberCard}`);
    });

    it('should not show the svg', () => {
      expect(fixture.debugElement.query(By.css(svgSelector))).toBeFalsy();
    });
  });

  describe('when the entity is NOT a bank account...', () => {
    it('should show 12 stars before the number', () => {
      const twelveStars = '**** **** ****';
      component.isBankAccount = false;
      component.numberCard = '1234';

      component.ngOnChanges();
      fixture.detectChanges();

      expect(el.querySelector(numberCardSelector).innerHTML).toBe(`${twelveStars} ${component.numberCard}`);
    });
  });
});
