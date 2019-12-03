import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditSubscriptionModalComponent } from './edit-subscription-modal.component';
import { MAPPED_SUBSCRIPTIONS, TIER } from '../../../../tests/subscriptions.fixtures.spec';
import { ToastrService } from 'ngx-toastr';
import { I18nService } from '../../../core/i18n/i18n.service';
import { EventService } from '../../../core/event/event.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { AnalyticsService } from '../../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../tests/analytics.fixtures.spec';
import {
  ViewEditSubscriptionPlan,
  ANALYTICS_EVENT_NAMES,
  SCREEN_IDS,
  AnalyticsPageView
} from '../../../core/analytics/analytics-constants';

describe('EditSubscriptionModalComponent', () => {
  let component: EditSubscriptionModalComponent;
  let fixture: ComponentFixture<EditSubscriptionModalComponent>;
  let activeModal: NgbActiveModal;
  let toastrService: ToastrService;
  let analyticsService: AnalyticsService;
  let eventService: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditSubscriptionModalComponent ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
          }
        },
        {
          provide: ToastrService, useValue: {
            error() {
            },
            show() {
            },
            i18nError() {
            },
            i18nSuccess() {
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(true),
                componentInstance: {}
              };
            }
          }
        },
        I18nService,
        EventService,
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSubscriptionModalComponent);
    component = fixture.componentInstance;
    toastrService = TestBed.get(ToastrService);
    activeModal = TestBed.get(NgbActiveModal);
    eventService = TestBed.get(EventService);
    component.subscription = MAPPED_SUBSCRIPTIONS[2];
    analyticsService = TestBed.get(AnalyticsService);
    fixture.detectChanges();
  });

  describe('OnInit', () => {
    it('should set the selected tier and plan', () => {
      component.ngOnInit();

      expect(component.selectedTier).toEqual(MAPPED_SUBSCRIPTIONS[2].selected_tier);
    });

    it('should send the page view event to analytics', () => {
      spyOn(analyticsService, 'trackPageView');
      const expectedPageView: AnalyticsPageView<ViewEditSubscriptionPlan> = {
        name: ANALYTICS_EVENT_NAMES.ViewEditSubscriptionPlan,
        attributes: {
          screenId: SCREEN_IDS.SubscriptionManagment
        }
      };
      component.ngOnInit();

      expect(analyticsService.trackPageView).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackPageView).toHaveBeenCalledWith(expectedPageView);
    });

    afterEach(() => {
      TestBed.resetTestingModule();
    });
  });

  describe('close', () => {
    it('should close the modal and redirect to the profile', () => {
      spyOn(activeModal, 'close');

      component.close();

      expect(activeModal.close).toHaveBeenCalled();
    })
  })

  describe('selectListingLimit', () => {
    it('should set the selected tier', () => {
      const tier = TIER;

      component.selectListingLimit(tier);

      expect(component.selectedTier).toEqual(tier);
    });
  });

});