import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UpgradePlanModalComponent } from './upgrade-plan-modal.component';
import { CustomCurrencyPipe } from '../../../../shared/custom-currency/custom-currency.pipe';
import { ItemService } from '../../../../core/item/item.service';
import { Observable } from 'rxjs';
import { Item } from '../../../../core/item/item';
import { MOCK_ITEM, PRODUCT_RESPONSE, MOCK_LISTING_FEE_PRODUCT, MOCK_LISTING_FEE_ORDER } from '../../../../../tests/item.fixtures.spec';
import { DecimalPipe } from '@angular/common';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';

describe('ListingfeeConfirmationModalComponent', () => {
  let component: UpgradePlanModalComponent;
  let fixture: ComponentFixture<UpgradePlanModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UpgradePlanModalComponent, CustomCurrencyPipe],
      providers: [
        DecimalPipe,
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            },
            dismiss() {
            }
          }
        },
        {
          provide: ItemService, useValue: {
            getListingFeeInfo() {
              return Observable.of({});
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(UpgradePlanModalComponent);
    component = fixture.componentInstance;
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
    trackingService = TestBed.get(TrackingService);
    spyOn(itemService, 'getListingFeeInfo').and.returnValue(Observable.of(MOCK_LISTING_FEE_PRODUCT.product_group.products[0]));
    fixture.detectChanges();
  }));

  describe('ngOnInit', () => {
    const item: Item = MOCK_ITEM;

    it('should get the listing fee information related to the item', () => {
      component.itemId = MOCK_ITEM.id;
      component.ngOnInit();

      expect(itemService.getListingFeeInfo).toHaveBeenCalledWith(item.id);
    });
  });

  describe('purchaseListingFee', () => {
    const item: Item = MOCK_ITEM;

    it('should save transactionType in localStorage', () => {
      spyOn(localStorage, 'setItem');

      component.purchaseListingFee();

      expect(localStorage.setItem).toHaveBeenCalledWith('transactionType', 'purchaseListingFee');
    });

    it('should close active modal with orderevent parameter', () => {
      component.itemId = MOCK_LISTING_FEE_ORDER.order[0].item_id;
      spyOn(activeModal, 'close');

      component.purchaseListingFee();

      expect(activeModal.close).toHaveBeenCalledWith(MOCK_LISTING_FEE_ORDER);
    });

    it('should send PURCHASE_LISTING_FEE_MODAL tracking event', () => {
      component.itemId = MOCK_ITEM.id;
      spyOn(trackingService, 'track');

      component.purchaseListingFee();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PURCHASE_LISTING_FEE_MODAL, { item_id: item.id });
    });
  });

});
