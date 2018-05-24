import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PlanDataComponent } from './plan-data.component';
import { PaymentService } from '../../../../core/payments/payment.service';
import { PurchaseService } from '../../../../core/payments/purchase.service';
import { Observable } from 'rxjs/Observable';
import { createPerksModelFixture, PURCHASES_MODEL } from '../../../../../tests/payments.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { MockedItemService } from '../../../../../tests/item.fixtures.spec';
import { ScheduledStatus } from '../../../../core/payments/payment.interface';

describe('PlanDataComponent', () => {
  let component: PlanDataComponent;
  let fixture: ComponentFixture<PlanDataComponent>;
  let loadPurchases: Function = jasmine.createSpy('loadPurchases');
  let paymentService: PaymentService;
  let purchaseService: PurchaseService;
  let modalService: NgbModal;
  let itemService: ItemService;

  const MOCK_STATUS: ScheduledStatus = {
    active: true,
    autorenew_alert: 0,
    autorenew_scheduled: { citybump: 16, countrybump: 21 }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDataComponent ],
      providers: [
        {provide: ItemService, useClass: MockedItemService},
        {
          provide: PaymentService, useValue: {
            getPerks() {
              return Observable.of({});
            },
            getStatus() {
              return Observable.of({MOCK_STATUS});
            }
          }
        },
        {
          provide: PurchaseService, useValue: {
          query() {
            return Observable.of({
              bumpItems: [],
              nationalBumpItems: []
            });
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              componentInstance: {
                loadPurchases: loadPurchases
              },
              result: Promise.resolve()
            };
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDataComponent);
    paymentService = TestBed.get(PaymentService);
    purchaseService = TestBed.get(PurchaseService);
    modalService = TestBed.get(NgbModal);
    itemService = TestBed.get(ItemService);
    component = fixture.componentInstance;
  });

  describe('ngChanges', () => {
    beforeEach(() => {
      component.loading = true;
      spyOn(paymentService, 'getPerks').and.returnValue(Observable.of(createPerksModelFixture()));
      spyOn(paymentService, 'getStatus').and.returnValue(Observable.of(MOCK_STATUS));
      spyOn(purchaseService, 'query').and.returnValue(Observable.of(PURCHASES_MODEL));
      component.ngOnChanges();
    });

    it('should call getPerks and set quantities', () => {
      expect(paymentService.getPerks).toHaveBeenCalled();
      expect(component.perks).toEqual(createPerksModelFixture());
    });

    it('should call query and set purchases', () => {
      expect(purchaseService.query).toHaveBeenCalled();
    });
    it('should set loading false', () => {
      expect(component.loading).toBe(false);
    });

    it('should get quantity of bumps scheduled', () => {
      expect(paymentService.getStatus).toHaveBeenCalled();
      expect(component.status).toEqual(MOCK_STATUS);
    });

    it('should get the number of city bumps in use', () => {
      expect(component.cityBumpsInUse).toEqual(0);
    });

    it('should get the number of city bumps in use', () => {
      expect(component.countryBumpsInUse).toEqual(0);
    });

  });
});
