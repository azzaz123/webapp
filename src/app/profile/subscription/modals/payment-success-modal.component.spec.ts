import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PaymentSuccessModalComponent } from './payment-success-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import {
  AnalyticsPageView,
  ViewSuccessSubscriptionPayment,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS
} from '../../../core/analytics/analytics-constants';
import { MockAnalyticsService } from '../../../../tests/analytics.fixtures.spec';

describe('PaymentSuccessModalComponent', () => {
  let component: PaymentSuccessModalComponent;
  let analyticsService: AnalyticsService;
  let fixture: ComponentFixture<PaymentSuccessModalComponent>;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSuccessModalComponent ],
      providers: [
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          },
        },
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSuccessModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.get(NgbActiveModal);
    analyticsService = TestBed.get(AnalyticsService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should send view page event', () => {
      spyOn(analyticsService, 'trackPageView');
      const expectedPageView: AnalyticsPageView<ViewSuccessSubscriptionPayment> = {
        name: ANALYTICS_EVENT_NAMES.ViewSuccessSubscriptionPayment,
        attributes: {
          screenId: SCREEN_IDS.ProfileSubscription
        }
      };

      component.ngOnInit();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageView);
    });
  });

  describe('close', () => {
    it('should close the modal', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });
});
