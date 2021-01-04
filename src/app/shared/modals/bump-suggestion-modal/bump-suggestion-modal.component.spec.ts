import { of } from 'rxjs';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ItemService } from '@core/item/item.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '@shared/pipes';
import { PaymentService } from '@core/payments/payment.service';
import { CreditInfo } from '@core/payments/payment.interface';
import { BumpSuggestionModalComponent } from './bump-suggestion-modal.component';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';

describe('BumpSuggestionModalComponent', () => {
  let component: BumpSuggestionModalComponent;
  let fixture: ComponentFixture<BumpSuggestionModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let paymentService: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        BumpSuggestionModalComponent,
        ButtonComponent,
        CustomCurrencyPipe,
      ],
      providers: [
        DecimalPipe,
        {
          provide: ItemService,
          useValue: {
            getCheapestProductPrice() {
              return of({ ['1']: '20' });
            },
          },
        },
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
        {
          provide: PaymentService,
          useValue: {
            getCreditInfo() {
              return of({});
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BumpSuggestionModalComponent);
    component = fixture.componentInstance;
    itemService = TestBed.inject(ItemService);
    activeModal = TestBed.inject(NgbActiveModal);
    paymentService = TestBed.inject(PaymentService);
  });

  describe('Share', () => {
    it('should open facebook link', () => {
      spyOn(window, 'open');
      component.item = MOCK_ITEM;

      component.facebookShare();

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=${encodeURIComponent(
          component.item.webLink
        )}`,
        'fbShareWindow',
        'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
      );
    });

    it('should open twiter link', () => {
      spyOn(window, 'open');
      component.item = MOCK_ITEM;

      component.twitterShare();

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          component.item.webLink
        )}`,
        'twShareWindow',
        'height=269,width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
      );
    });

    it('should not disable shere icons if item data is available', () => {
      component.item = MOCK_ITEM;

      fixture.detectChanges();

      const shareIcons = fixture.debugElement.query(
        By.css('.social-icons__disabled')
      );
      expect(shareIcons).toBeFalsy();
    });

    it('should disable shere icons if item data is not available', () => {
      fixture.detectChanges();

      const shareIcons = fixture.debugElement.query(
        By.css('.social-icons__disabled')
      );

      expect(shareIcons).toBeTruthy();
    });
  });

  describe('Close modal', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
    });

    it('should be closed pressing close button', () => {
      const closeButton = fixture.debugElement.query(By.css('.modal-close'))
        .nativeElement;

      closeButton.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
      expect(activeModal.close).toHaveBeenLastCalledWith(false);
    });

    it('should be closed pressing CTA button', () => {
      fixture.detectChanges();
      const submitButton = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      submitButton.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
      expect(activeModal.close).toHaveBeenLastCalledWith(true);
    });
  });

  describe('CTA button', () => {
    it('should show price if has price and currency', () => {
      component.productPrice = 10;
      component.productCurrency = 'EUR';

      fixture.detectChanges();
      const submitButton = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      expect(submitButton.textContent).toEqual('Feature it from 10€');
    });

    it('should not show price if has not price', () => {
      component.productCurrency = 'EUR';

      fixture.detectChanges();
      const submitButton = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      expect(submitButton.textContent).toEqual('Feature it');
    });

    it('should not show price if has not currency', () => {
      component.productPrice = 10;

      fixture.detectChanges();
      const submitButton = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      expect(submitButton.textContent).toEqual('Feature it');
    });
  });
});
