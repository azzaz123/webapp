import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PlanDataComponent } from './plan-data.component';
import { PaymentService } from '../../../../core/payments/payment.service';
import { PurchaseService } from '../../../../core/payments/purchase.service';
import { Observable } from 'rxjs/Observable';
import { PURCHASES, createPerksModelFixture } from '../../../../../tests/payments.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { MockedItemService } from '../../../../../tests/item.fixtures.spec';

describe('PlanDataComponent', () => {
  let component: PlanDataComponent;
  let fixture: ComponentFixture<PlanDataComponent>;
  let loadPurchases: Function = jasmine.createSpy('loadPurchases');
  let paymentService: PaymentService;
  let purchaseService: PurchaseService;
  let modalService: NgbModal;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanDataComponent ],
      providers: [
        {provide: ItemService, useClass: MockedItemService},
        {
          provide: PaymentService, useValue: {
            getPerks() {
              return Observable.of({});
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
      spyOn(purchaseService, 'query').and.returnValue(Observable.of(PURCHASES));
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
      expect(component.loading).toBeFalsy();
    });

  });
});
