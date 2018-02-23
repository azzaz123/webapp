import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UploadConfirmationModalComponent } from './upload-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WindowRef, MockTrackingService, MOCK_ITEM } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { ItemService } from '../../../../core/item/item.service';
import { PRODUCT_RESPONSE, ORDER_EVENT, PRODUCT_DURATION_ID } from '../../../../../tests/item.fixtures';
import { Observable } from 'rxjs/Observable';

describe('UploadConfirmationModalComponent', () => {
  let component: UploadConfirmationModalComponent;
  let fixture: ComponentFixture<UploadConfirmationModalComponent>;
  let trackingService: TrackingService;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploadConfirmationModalComponent],
      providers: [
        NgbActiveModal,
        WindowRef,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: ItemService, useValue: {
            getUrgentProducts() {}
          }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        }
      ],
        schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
  });

  describe('ngOnInit', () => {
    it('should track open', () => {
      spyOn(trackingService, 'track');

      fixture.detectChanges();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.UPLOADFORM_SUCCESS);
    });
  });

  describe('urgentPrice', () => {
    it('should call urgentPrice', () => {
      spyOn(itemService, 'getUrgentProducts').and.returnValue(Observable.of(PRODUCT_RESPONSE));

      component.item = MOCK_ITEM;
      component.urgentPrice();

      expect(itemService.getUrgentProducts).toHaveBeenCalledWith(MOCK_ITEM.id);
      expect(component.productPrice).toEqual(PRODUCT_RESPONSE.durations[0].market_code);
      expect(component.productId).toEqual(PRODUCT_RESPONSE.durations[0].id);
    });
  });

  describe('featureUrgentItem', () => {
    it('should close the modal with an order event', () => {
      spyOn(activeModal, 'close');

      component.item = MOCK_ITEM;
      component.productId = PRODUCT_DURATION_ID;
      component.productPrice = PRODUCT_RESPONSE.durations[0].market_code;
      component.featureUrgentItem();

      expect(activeModal.close).toHaveBeenCalledWith(ORDER_EVENT)
    });
  });

});
