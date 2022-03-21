import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { CurrencyCode } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { ItemSalePriceApiService } from '@api/items/sale_price';
import { SCREEN_IDS } from '@core/analytics/analytics-constants';
import { MOCK_INBOX_CONVERSATION_AS_SELLER } from '@fixtures/chat';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxItem } from '@private/features/chat/core/model';
import { DeliveryBannerTrackingEventsService } from '@private/features/chat/modules/delivery-banner/services/delivery-banner-tracking-events/delivery-banner-tracking-events.service';
import { ButtonComponent } from '@shared/button/button.component';
import { of, throwError } from 'rxjs';

import { EditItemSalePriceModalComponent, EDIT_ITEM_SALE_PRICE_ERROR } from './edit-item-sale-price-modal.component';

describe('EditItemSalePriceModalComponent', () => {
  let component: EditItemSalePriceModalComponent;
  let fixture: ComponentFixture<EditItemSalePriceModalComponent>;
  let activeModal: NgbActiveModal;
  let itemSalePriceApiService: ItemSalePriceApiService;
  let deliveryBannerTrackingEventsService: DeliveryBannerTrackingEventsService;
  let submitButtonElement: DebugElement;
  let spyOnHandleSubmit: jasmine.Spy;
  let spyOnItemPriceUpdateApi: jest.SpyInstance;
  let cd: ChangeDetectorRef;

  const MOCK_CONVERSATION_ITEM: InboxItem = MOCK_INBOX_CONVERSATION_AS_SELLER.item;
  const closeButtonSelector: string = '.EditItemSalePriceModal__close';
  const inputErrorSelector: string = '.EditItemSalePriceModal__newPriceInputError > span';
  const submitButtonSelector: string = 'button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [EditItemSalePriceModalComponent, ButtonComponent],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: { close: () => {} } },
        { provide: ItemSalePriceApiService, useValue: { update: () => of(null) } },
        {
          provide: DeliveryBannerTrackingEventsService,
          useValue: {
            trackSaveItemPrice() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemSalePriceModalComponent);
    cd = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    activeModal = TestBed.inject(NgbActiveModal);
    itemSalePriceApiService = TestBed.inject(ItemSalePriceApiService);
    deliveryBannerTrackingEventsService = TestBed.inject(DeliveryBannerTrackingEventsService);
    component = fixture.componentInstance;
    component.item = MOCK_CONVERSATION_ITEM;
    fixture.detectChanges();

    spyOnHandleSubmit = spyOn(component, 'handleSubmit').and.callThrough();
    spyOnItemPriceUpdateApi = jest.spyOn(itemSalePriceApiService, 'update').mockReturnValue(of(null));
    submitButtonElement = fixture.debugElement.query(By.css(submitButtonSelector));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user clicks on close modal', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
      const closeButtonElement: DebugElement = fixture.debugElement.query(By.css(closeButtonSelector));
      closeButtonElement.nativeElement.click();
    });

    it('should close the modal', () => {
      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user inputs a price below the minimum', () => {
    beforeEach(() => {
      spyOn(deliveryBannerTrackingEventsService, 'trackSaveItemPrice');

      modifyPriceInput(0.25);
    });

    describe('and when user submits the form', () => {
      beforeEach(() => submitForm());

      afterEach(() => {
        spyOnHandleSubmit.calls.reset();
      });

      it('should handle the submit', async () => {
        expect(component.handleSubmit).toHaveBeenCalledTimes(1);
      });

      it('should show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeTruthy();
      });

      it('should be minimum price error type', () => {
        expect(component.inputError).toBe(EDIT_ITEM_SALE_PRICE_ERROR.MIN);
      });

      it('should NOT ask edit item price to server', () => {
        expect(itemSalePriceApiService.update).not.toHaveBeenCalled();
      });

      it('should NOT track the event', () => {
        expect(deliveryBannerTrackingEventsService.trackSaveItemPrice).not.toHaveBeenCalled();
      });
    });
  });

  describe('when user inputs a price over the maximum', () => {
    beforeEach(() => {
      spyOn(deliveryBannerTrackingEventsService, 'trackSaveItemPrice');
      modifyPriceInput(288288);
    });

    describe('and when user submits the form', () => {
      beforeEach(() => submitForm());

      it('should show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeTruthy();
      });

      it('should be minimum price error type', () => {
        expect(component.inputError).toBe(EDIT_ITEM_SALE_PRICE_ERROR.MAX);
      });

      it('should NOT ask edit item price to server', () => {
        expect(itemSalePriceApiService.update).not.toHaveBeenCalled();
      });

      it('should NOT track the event', () => {
        expect(deliveryBannerTrackingEventsService.trackSaveItemPrice).not.toHaveBeenCalled();
      });
    });
  });

  describe('and when user inputs a valid price', () => {
    const MOCK_VALID_INPUT: number = 420;
    let spyOnActiveModalClose: jasmine.Spy;

    beforeEach(() => modifyPriceInput(MOCK_VALID_INPUT));

    describe('and when user submits the form', () => {
      beforeEach(() => {
        spyOn(deliveryBannerTrackingEventsService, 'trackSaveItemPrice');
        spyOnActiveModalClose = spyOn(activeModal, 'close');
        submitForm();
      });

      it('should NOT show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeFalsy();
      });

      it('should ask edit item price to server', () => {
        const expectedMoney: Money = mapNumberAndCurrencyCodeToMoney({
          number: MOCK_VALID_INPUT,
          currency: MOCK_CONVERSATION_ITEM.price.currency as CurrencyCode,
        });
        const lastCallToItemPriceUpdateApi = spyOnItemPriceUpdateApi.mock.calls[0];

        expect(spyOnItemPriceUpdateApi).toHaveBeenCalledTimes(1);
        expect(JSON.stringify(lastCallToItemPriceUpdateApi)).toEqual(
          JSON.stringify([MOCK_INBOX_CONVERSATION_AS_SELLER.item.id, expectedMoney])
        );
      });

      it('should track the event', () => {
        expect(deliveryBannerTrackingEventsService.trackSaveItemPrice).toHaveBeenCalledTimes(1);
        expect(deliveryBannerTrackingEventsService.trackSaveItemPrice).toHaveBeenCalledWith({
          itemId: MOCK_CONVERSATION_ITEM.id,
          categoryId: MOCK_CONVERSATION_ITEM.categoryId,
          itemPrice: MOCK_CONVERSATION_ITEM.price.amount,
          newItemPrice: MOCK_VALID_INPUT,
          screenId: SCREEN_IDS.Chat,
        });
      });

      describe('and when server responses with valid answer', () => {
        it('should close the modal', () => {
          expect(spyOnActiveModalClose).toHaveBeenCalledTimes(1);
        });

        it('should update item price in web context', () => {
          expect(MOCK_INBOX_CONVERSATION_AS_SELLER.item.price.amount).toEqual(MOCK_VALID_INPUT);
        });
      });

      describe('and when server responses with invalid answer', () => {
        beforeEach(() => {
          spyOnActiveModalClose.calls.reset();
          spyOnItemPriceUpdateApi.mockReturnValue(throwError('error'));
          submitForm();
        });

        it('should NOT close the modal', () => {
          expect(activeModal.close).not.toHaveBeenCalled();
        });

        it('should show an error in the UI', () => {
          const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

          expect(inputErrorElement).toBeTruthy();
        });

        it('should be default price error type', () => {
          expect(component.inputError).toBe(EDIT_ITEM_SALE_PRICE_ERROR.DEFAULT);
        });
      });
    });
  });

  const modifyPriceInput: Function = (validPrice: number) => {
    component.newItemSalePriceForm.controls['newPrice'].patchValue(validPrice);
    cd.markForCheck();
    fixture.detectChanges();
  };

  const submitForm: Function = () => {
    submitButtonElement.nativeElement.click();
    cd.markForCheck();
    fixture.detectChanges();
  };
});
