import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_INBOX_CONVERSATION_AS_BUYER, MOCK_INBOX_CONVERSATION_AS_SELLER, MOCK_INBOX_CONVERSATION_BASIC } from '@fixtures/chat';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DeliveryConversationContextAsBuyerService } from '../delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from '../delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';

import { DeliveryConversationContextService } from './delivery-conversation-context.service';

describe('DeliveryConversationContextService', () => {
  let service: DeliveryConversationContextService;
  let deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService;
  let deliveryConversationContextAsSellerService: DeliveryConversationContextAsSellerService;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryConversationContextService,
        {
          provide: DeliveryConversationContextAsBuyerService,
          useValue: { getBannerPropertiesAsBuyer: () => of(null), handleBannerCTAClick: () => {}, handleThirdVoiceCTAClick: () => {} },
        },
        {
          provide: DeliveryConversationContextAsSellerService,
          useValue: { getBannerPropertiesAsSeller: () => of(null), handleBannerCTAClick: () => {}, handleThirdVoiceCTAClick: () => {} },
        },
        { provide: NgbModal, useValue: { open: () => {} } },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextService);
    deliveryConversationContextAsBuyerService = TestBed.inject(DeliveryConversationContextAsBuyerService);
    deliveryConversationContextAsSellerService = TestBed.inject(DeliveryConversationContextAsSellerService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when trying to update', () => {
    it('should notify loading started', fakeAsync(() => {
      const MOCK_DELAY_MS: number = 100;
      spyOn(deliveryConversationContextAsSellerService, 'getBannerPropertiesAsSeller').and.returnValue(of().pipe(delay(MOCK_DELAY_MS)));
      let result: boolean;

      service.update(MOCK_INBOX_CONVERSATION_AS_SELLER);
      service.loading$.subscribe((loading) => (result = loading));
      tick();

      expect(result).toEqual(true);
      discardPeriodicTasks();
    }));

    describe('and when the current user is the owner of the item in the conversation', () => {
      beforeEach(fakeAsync(() => {
        spyOn(deliveryConversationContextAsSellerService, 'getBannerPropertiesAsSeller').and.callThrough();
        service.update(MOCK_INBOX_CONVERSATION_AS_SELLER);
        tick();
      }));

      it('should ask for context from the sellers perspective', () => {
        expect(deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller).toHaveBeenCalledWith(
          MOCK_INBOX_CONVERSATION_AS_SELLER
        );
        expect(deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller).toHaveBeenCalledTimes(1);
      });

      it('should notify loading ended', fakeAsync(() => {
        let result: boolean;

        service.loading$.subscribe((loading) => (result = loading));
        tick();

        expect(result).toEqual(false);
      }));
    });

    describe('and when the current user is NOT the owner of the item in the conversation', () => {
      beforeEach(fakeAsync(() => {
        spyOn(deliveryConversationContextAsBuyerService, 'getBannerPropertiesAsBuyer').and.callThrough();
        service.update(MOCK_INBOX_CONVERSATION_AS_BUYER);
        tick();
      }));

      it('should ask for context from the buyers perspective', () => {
        expect(deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer).toHaveBeenCalledWith(MOCK_INBOX_CONVERSATION_AS_BUYER);
        expect(deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer).toHaveBeenCalledTimes(1);
      });

      it('should notify loading ended', fakeAsync(() => {
        let result: boolean;

        service.loading$.subscribe((loading) => (result = loading));
        tick();

        expect(result).toEqual(false);
      }));
    });
  });

  describe('when reseting state', () => {
    beforeEach(() => {
      service.update(MOCK_INBOX_CONVERSATION_BASIC);
      service.reset();
    });

    beforeAll(() => {
      jest.spyOn(Subscription.prototype, 'unsubscribe');
    });

    afterAll(() => {
      jest.spyOn(Subscription.prototype, 'unsubscribe').mockRestore();
    });

    it('should emit empty banner properties', fakeAsync(() => {
      service.bannerProperties$.subscribe((result) => expect(result).toBeFalsy());
      tick();
    }));

    it('should cancel all pending subscriptions', () => {
      expect(Subscription.prototype.unsubscribe).toHaveBeenCalled();
    });

    it('should notify loading ended', fakeAsync(() => {
      let result: boolean;

      service.loading$.subscribe((loading) => (result = loading));
      tick();

      expect(result).toEqual(false);
    }));
  });

  describe('when handling banner CTA actions', () => {
    describe('and when action is to open awareness modal', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.AWARENESS_MODAL);
      });

      it('should open awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
        expect(modalService.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is open the payview', () => {
      beforeEach(() => {
        spyOn(deliveryConversationContextAsBuyerService, 'handleBannerCTAClick');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.OPEN_PAYVIEW);
      });

      it('should delegate action to buyer context', () => {
        expect(deliveryConversationContextAsBuyerService.handleBannerCTAClick).toHaveBeenCalledWith(
          MOCK_INBOX_CONVERSATION_BASIC,
          DELIVERY_BANNER_ACTION.OPEN_PAYVIEW
        );
        expect(deliveryConversationContextAsBuyerService.handleBannerCTAClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is edit item sale price', () => {
      beforeEach(() => {
        spyOn(deliveryConversationContextAsSellerService, 'handleBannerCTAClick');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.EDIT_ITEM_SALE_PRICE);
      });

      it('should delegate action to seller context', () => {
        expect(deliveryConversationContextAsSellerService.handleBannerCTAClick).toHaveBeenCalledWith(
          MOCK_INBOX_CONVERSATION_BASIC,
          DELIVERY_BANNER_ACTION.EDIT_ITEM_SALE_PRICE
        );
        expect(deliveryConversationContextAsSellerService.handleBannerCTAClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is activate shipping', () => {
      beforeEach(() => {
        spyOn(deliveryConversationContextAsSellerService, 'handleBannerCTAClick');
        service.handleBannerCTAClick(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING);
      });

      it('should delegate action to seller context', () => {
        expect(deliveryConversationContextAsSellerService.handleBannerCTAClick).toHaveBeenCalledWith(
          MOCK_INBOX_CONVERSATION_BASIC,
          DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING
        );
        expect(deliveryConversationContextAsSellerService.handleBannerCTAClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('when handling third voice CTA click', () => {
    describe('and when the current user is the seller', () => {
      beforeEach(() => {
        spyOn(deliveryConversationContextAsSellerService, 'handleThirdVoiceCTAClick');
        service.handleThirdVoiceCTAClick(MOCK_INBOX_CONVERSATION_AS_SELLER);
      });

      it('should delegate click handling to seller context', () => {
        expect(deliveryConversationContextAsSellerService.handleThirdVoiceCTAClick).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when the current user is the buyer', () => {
      beforeEach(() => {
        spyOn(deliveryConversationContextAsBuyerService, 'handleThirdVoiceCTAClick');
        service.handleThirdVoiceCTAClick(MOCK_INBOX_CONVERSATION_AS_BUYER);
      });

      it('should delegate click handling to seller context', () => {
        expect(deliveryConversationContextAsBuyerService.handleThirdVoiceCTAClick).toHaveBeenCalledTimes(1);
      });
    });
  });
});
