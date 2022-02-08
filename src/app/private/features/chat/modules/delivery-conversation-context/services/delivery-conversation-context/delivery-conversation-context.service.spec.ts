import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FeatureFlagService } from '@core/user/featureflag.service';
import { MOCK_INBOX_CONVERSATION_AS_BUYER, MOCK_INBOX_CONVERSATION_AS_SELLER, MOCK_INBOX_CONVERSATION_BASIC } from '@fixtures/chat';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TRXAwarenessModalComponent } from '@private/features/delivery/modals/trx-awareness-modal/trx-awareness-modal.component';
import { of, Subscription } from 'rxjs';
import { DELIVERY_BANNER_ACTION } from '../../../delivery-banner/enums/delivery-banner-action.enum';
import { DeliveryConversationContextAsBuyerService } from '../delivery-conversation-context-as-buyer/delivery-conversation-context-as-buyer.service';
import { DeliveryConversationContextAsSellerService } from '../delivery-conversation-context-as-seller/delivery-conversation-context-as-seller.service';

import { DeliveryConversationContextService } from './delivery-conversation-context.service';

describe('DeliveryConversationContextService', () => {
  let service: DeliveryConversationContextService;
  let deliveryConversationContextAsBuyerService: DeliveryConversationContextAsBuyerService;
  let deliveryConversationContextAsSellerService: DeliveryConversationContextAsSellerService;
  let featureFlagService: FeatureFlagService;
  let modalService: NgbModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DeliveryConversationContextService,
        { provide: FeatureFlagService, useClass: FeatureFlagServiceMock },
        { provide: DeliveryConversationContextAsBuyerService, useValue: { getBannerPropertiesAsBuyer: () => of(null) } },
        { provide: DeliveryConversationContextAsSellerService, useValue: { getBannerPropertiesAsSeller: () => of(null) } },
        { provide: NgbModal, useValue: { open: () => {} } },
      ],
    });
    service = TestBed.inject(DeliveryConversationContextService);
    featureFlagService = TestBed.inject(FeatureFlagService);
    deliveryConversationContextAsBuyerService = TestBed.inject(DeliveryConversationContextAsBuyerService);
    deliveryConversationContextAsSellerService = TestBed.inject(DeliveryConversationContextAsSellerService);
    modalService = TestBed.inject(NgbModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when trying to update', () => {
    describe('and when delivery features are enabled', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'getLocalFlag').and.returnValue(of(true));
      });

      describe('and when the current user is the owner of the item in the conversation', () => {
        beforeEach(fakeAsync(() => {
          spyOn(deliveryConversationContextAsSellerService, 'getBannerPropertiesAsSeller').and.callThrough();
          service.update(MOCK_INBOX_CONVERSATION_AS_SELLER);
          tick();
        }));

        it('should ask for context from the sellers perspective', () => {
          expect(deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller).toHaveBeenCalledWith(
            MOCK_INBOX_CONVERSATION_AS_SELLER.item.id
          );
          expect(deliveryConversationContextAsSellerService.getBannerPropertiesAsSeller).toHaveBeenCalledTimes(1);
        });
      });

      describe('and when the current user is NOT the owner of the item in the conversation', () => {
        beforeEach(fakeAsync(() => {
          spyOn(deliveryConversationContextAsBuyerService, 'getBannerPropertiesAsBuyer').and.callThrough();
          service.update(MOCK_INBOX_CONVERSATION_AS_BUYER);
          tick();
        }));

        it('should ask for context from the buyers perspective', () => {
          expect(deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer).toHaveBeenCalledWith(
            MOCK_INBOX_CONVERSATION_AS_BUYER.item.id
          );
          expect(deliveryConversationContextAsBuyerService.getBannerPropertiesAsBuyer).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe('and when delivery features are NOT enabled', () => {
      beforeEach(() => {
        spyOn(featureFlagService, 'getLocalFlag').and.returnValue(of(true));
      });

      it('should give a not defined banner', fakeAsync(() => {
        service.update(MOCK_INBOX_CONVERSATION_BASIC);
        tick();

        service.bannerProperties$.subscribe((response) => expect(response).toBeFalsy());
        tick();
      }));
    });
  });

  describe('when reseting state', () => {
    beforeAll(() => {
      jest.spyOn(Subscription.prototype, 'unsubscribe');
      service.update(MOCK_INBOX_CONVERSATION_BASIC);
      service.reset();
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
  });

  describe('when handling CTA actions', () => {
    describe('and when action is to open awareness modal', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleClickCTA(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.AWARENESS_MODAL);
      });

      it('should open awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
        expect(modalService.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is open the payview', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleClickCTA(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.OPEN_PAYVIEW);
      });

      it('should open awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
        expect(modalService.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is change item price', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleClickCTA(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.CHANGE_ITEM_PRICE);
      });

      it('should open awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
        expect(modalService.open).toHaveBeenCalledTimes(1);
      });
    });

    describe('and when action is activate shipping', () => {
      beforeEach(() => {
        spyOn(modalService, 'open');
        service.handleClickCTA(MOCK_INBOX_CONVERSATION_BASIC, DELIVERY_BANNER_ACTION.ACTIVATE_SHIPPING);
      });

      it('should open awareness modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(TRXAwarenessModalComponent);
        expect(modalService.open).toHaveBeenCalledTimes(1);
      });
    });
  });
});
