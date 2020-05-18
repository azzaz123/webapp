import { TestBed, ComponentFixture } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of as observableOf } from 'rxjs';

import { TooManyItemsModalComponent } from './too-many-items-modal.component';
import { ButtonComponent } from '../../../button/button.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ItemService,  } from '../../../../core/item/item.service';
import { SubscriptionsService } from '../../../../core/subscriptions/subscriptions.service';
import { MOCK_ITEM_V3_2, MOCK_ITEM_V3_3 } from '../../../../../tests/item.fixtures.spec';
import { MockSubscriptionService, MAPPED_SUBSCRIPTIONS_ADDED } from '../../../../../tests/subscriptions.fixtures.spec';
import { SUBSCRIPTION_TYPES } from '../../../../core/subscriptions/subscriptions.service';
import { By } from '@angular/platform-browser';
import { AnalyticsService } from '../../../../core/analytics/analytics.service';
import { MockAnalyticsService } from '../../../../../tests/analytics.fixtures.spec';
import {
  AnalyticsEvent,
  ClickSubscriptionLimitReached,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  SCREEN_IDS
} from '../../../../core/analytics/analytics-constants';

describe('TooManyItemsModalComponent', () => {
  let component: TooManyItemsModalComponent;
  let fixture: ComponentFixture<TooManyItemsModalComponent>;
  let itemService: ItemService;
  let subscriptionsService: SubscriptionsService;
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        RouterTestingModule
      ],
      declarations: [
        TooManyItemsModalComponent,
        ButtonComponent
      ],
      providers: [
        NgbActiveModal,
        { provide: SubscriptionsService, useClass: MockSubscriptionService },
        {
          provide: ItemService, useValue: {
            get() {
              return observableOf(MOCK_ITEM_V3_3);
            }
          }
        },
        {
          provide: AnalyticsService, useClass: MockAnalyticsService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TooManyItemsModalComponent);
    itemService = TestBed.get(ItemService);
    subscriptionsService = TestBed.get(SubscriptionsService);
    component = fixture.componentInstance;
    component.type =  SUBSCRIPTION_TYPES.stripe;
    fixture.detectChanges();

    analyticsService = TestBed.get(AnalyticsService);
    spyOn(analyticsService, 'trackEvent');
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(subscriptionsService, 'getSubscriptions').and.returnValue(observableOf(MAPPED_SUBSCRIPTIONS_ADDED));
    });
    describe('subscription has free trial', () => {
      it('should set isFreeTrial to true', () => {
        spyOn(itemService, 'get').and.returnValue(observableOf(MOCK_ITEM_V3_3));

        component.itemId = MOCK_ITEM_V3_3.id;
        component.ngOnInit();
        
        expect(component.isFreeTrial).toBe(true);
      });
    });
    describe('subscription has no free trial', () => {
      it('should set isFreeTrial to false', () => {
        spyOn(itemService, 'get').and.returnValue(observableOf(MOCK_ITEM_V3_2));

        component.itemId = MOCK_ITEM_V3_2.id;
        component.ngOnInit();

        expect(component.isFreeTrial).toBe(false);
      });
    });
  });

  describe('trackClickGoToSubscriptions', () => {
    it('should send event to analytics', () => {
      const expectedEvent: AnalyticsEvent<ClickSubscriptionLimitReached> = {
        name: ANALYTICS_EVENT_NAMES.ClickSubscriptionLimitReached,
        eventType: ANALYTIC_EVENT_TYPES.Other,
        attributes: {
          screenId: SCREEN_IDS.MyCatalog,
        }
      };

      component.trackClickGoToSubscriptions();

      expect(analyticsService.trackEvent).toHaveBeenCalledTimes(1);
      expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
    });
  });

});
