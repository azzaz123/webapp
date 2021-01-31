import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import {
  LOCAL_STORAGE_TRY_PRO_SLOT,
  TryProSlotComponent,
} from './try-pro-slot.component';
import { SubscriptionsService } from '@core/subscriptions/subscriptions.service';
import { MockSubscriptionService } from '@fixtures/subscriptions.fixtures.spec';
import { UserService } from '@core/user/user.service';
import { MockedUserService, USER_ID } from '@fixtures/user.fixtures.spec';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from '@shared/button/button.component';
import { of } from 'rxjs';

fdescribe('TryProSlotItemComponent', () => {
  let component: TryProSlotComponent;
  let analyticsService: AnalyticsService;
  let subscriptionService: SubscriptionsService;
  let router: Router;
  let fixture: ComponentFixture<TryProSlotComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TryProSlotComponent, ButtonComponent],
        providers: [
          { provide: AnalyticsService, useClass: MockAnalyticsService },
          { provide: SubscriptionsService, useClass: MockSubscriptionService },
          { provide: UserService, useClass: MockedUserService },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TryProSlotComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService);
    subscriptionService = TestBed.inject(SubscriptionsService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('CTA text', () => {
    it('should show trial text', () => {
      spyOn(subscriptionService, 'hasOneTrialSubscription').and.returnValue(
        true
      );

      component.ngOnInit();
      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      expect(submitButton.textContent).toEqual('Become a PRO for free');
    });

    it('should show default text', () => {
      spyOn(subscriptionService, 'hasOneTrialSubscription').and.returnValue(
        false
      );

      component.ngOnInit();
      fixture.detectChanges();

      const submitButton: HTMLElement = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      expect(submitButton.textContent).toEqual('More information');
    });

    describe('when click CTA button', () => {
      it('should redirect to subscriptions', () => {
        spyOn(router, 'navigate');

        const submitButton: HTMLElement = fixture.debugElement.query(
          By.directive(ButtonComponent)
        ).nativeElement;

        submitButton.click();

        expect(router.navigate).toBeCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['profile/subscriptions']);
      });
    });

    describe('when click close', () => {
      it('should emit close event', () => {
        spyOn(component.close, 'emit');

        component.onClose();

        expect(component.close.emit).toBeCalledTimes(1);
      });

      it('should emit close event', () => {
        spyOn(localStorage, 'setItem');

        component.onClose();

        expect(localStorage.setItem).toBeCalledTimes(1);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          `${USER_ID}-${LOCAL_STORAGE_TRY_PRO_SLOT}`,
          'true'
        );
      });
    });
  });
});
