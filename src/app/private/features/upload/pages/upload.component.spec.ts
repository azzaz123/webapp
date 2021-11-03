import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickItemCategoryUpload,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { CARS_CATEGORY } from '@core/item/item-categories';
import { MockTrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.fixtures.spec';
import { SessionProfileDataLocation } from '@core/trust-and-safety/trust-and-safety.interface';
import { TrustAndSafetyService } from '@core/trust-and-safety/trust-and-safety.service';
import { UserService } from '@core/user/user.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { NgxPermissionsModule } from 'ngx-permissions';
import { of } from 'rxjs';
import { UploadComponent } from './upload.component';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let userService: UserService;
  let trustAndSafetyService: TrustAndSafetyService;
  let analyticsService: AnalyticsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [NgxPermissionsModule.forRoot()],
        declarations: [UploadComponent],
        schemas: [NO_ERRORS_SCHEMA],
        providers: [
          {
            provide: UserService,
            useValue: {
              get isPro() {
                return false;
              },
              isProfessional() {
                return of(false);
              },
            },
          },
          {
            provide: TrustAndSafetyService,
            useValue: MockTrustAndSafetyService,
          },
          { provide: AnalyticsService, useClass: MockAnalyticsService },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    userService = TestBed.inject(UserService);
    trustAndSafetyService = TestBed.inject(TrustAndSafetyService);
    analyticsService = TestBed.inject(AnalyticsService);
    component = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setCategory');
    });

    it('should set category cars if user is professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));

      component.ngOnInit();

      expect(component.setCategory).toHaveBeenCalledWith(CARS_CATEGORY);
    });

    it('should not set any category if user is not professional', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(false));

      component.ngOnInit();

      expect(component.setCategory).not.toHaveBeenCalled();
    });

    it('should delegate profiling to trust and safety team', () => {
      spyOn(trustAndSafetyService, 'submitProfile');

      component.ngOnInit();

      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledTimes(1);
      expect(trustAndSafetyService.submitProfile).toHaveBeenCalledWith(SessionProfileDataLocation.OPEN_CREATE_LISTING);
    });
  });

  describe('setCategory', () => {
    beforeEach(() => {
      spyOn(analyticsService, 'trackEvent').and.callThrough();
    });
    it('should set categoryId', () => {
      const CATEGORY_ID = 123;

      component.setCategory(CATEGORY_ID.toString());

      expect(component.categoryId).toBe(CATEGORY_ID.toString());
    });

    describe('and category is less than 0', () => {
      beforeEach(() => {
        component.setCategory('-1');
      });

      it('should emit event with category id 0', () => {
        const expectedEvent: AnalyticsEvent<ClickItemCategoryUpload> = {
          name: ANALYTICS_EVENT_NAMES.ClickItemCategoryUpload,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.Upload,
            categoryId: 0,
            isPro: false,
          },
        };

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });
    describe('and category is more than 0', () => {
      beforeEach(() => {
        component.setCategory('1');
      });

      it('should emit event', () => {
        const expectedEvent: AnalyticsEvent<ClickItemCategoryUpload> = {
          name: ANALYTICS_EVENT_NAMES.ClickItemCategoryUpload,
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          attributes: {
            screenId: SCREEN_IDS.Upload,
            categoryId: 1,
            isPro: false,
          },
        };

        expect(analyticsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      });
    });
  });

  describe('validationError', () => {
    it('should set scrollTop to 0', () => {
      component.scrollPanel = {
        nativeElement: {},
      };

      component.validationError();

      expect(component.scrollPanel.nativeElement.scrollTop).toBe(0);
    });
  });
});
