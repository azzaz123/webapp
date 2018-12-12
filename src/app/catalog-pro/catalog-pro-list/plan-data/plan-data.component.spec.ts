import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { PlanDataComponent } from './plan-data.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PaymentService } from '../../../core/payments/payment.service';
import { ItemService } from '../../../core/item/item.service';
import { ScheduledStatus } from '../../../core/payments/payment.interface';
import { MockedItemService } from '../../../../tests/item.fixtures.spec';
import { createPerksModelFixture } from '../../../../tests/payments.fixtures.spec';

describe('PlanDataComponent', () => {
  let component: PlanDataComponent;
  let fixture: ComponentFixture<PlanDataComponent>;
  let loadPurchases: Function = jasmine.createSpy('loadPurchases');
  let paymentService: PaymentService;
  let modalService: NgbModal;
  let itemService: ItemService;

  const MOCK_STATUS: ScheduledStatus = {
    active: true,
    autorenew_alert: 0,
    autorenew_scheduled: { citybump: 16, countrybump: 21 },
    purchased: { citybump: 1, countrybump: 2 }
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
    modalService = TestBed.get(NgbModal);
    itemService = TestBed.get(ItemService);
    component = fixture.componentInstance;
  });

  describe('ngChanges', () => {
    beforeEach(() => {
      component.loading = true;
      spyOn(paymentService, 'getPerks').and.returnValue(Observable.of(createPerksModelFixture()));
      spyOn(paymentService, 'getStatus').and.returnValue(Observable.of(MOCK_STATUS));
      component.ngOnChanges();
    });

    it('should call getPerks and set quantities', () => {
      expect(paymentService.getPerks).toHaveBeenCalled();
      expect(component.perks).toEqual(createPerksModelFixture());
    });

    it('should set loading false', () => {
      expect(component.loading).toBe(false);
    });

    it('should get quantity of bumps scheduled', () => {
      expect(paymentService.getStatus).toHaveBeenCalled();
      expect(component.status).toEqual(MOCK_STATUS);
    });

  });
});
