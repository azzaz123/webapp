import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '../core/user/user.service';
import { Observable } from 'rxjs';
import { MOCK_USER, MOTORPLAN_DATA, USER_WEB_SLUG, USERS_STATS_RESPONSE, PROFILE_SUB_INFO, PROFILE_NOT_SUB_INFO } from '../../tests/user.fixtures.spec';
import { I18nService } from '../core/i18n/i18n.service';
import { environment } from '../../environments/environment';
import { NgxPermissionsModule } from 'ngx-permissions';
import { SubscriptionsService } from '../core/subscriptions/subscriptions.service';
import { StripeService } from '../core/stripe/stripe.service';
import { HttpService } from '../core/http/http.service';
import { FeatureflagService } from '../core/user/featureflag.service';
import { MAPPED_SUBSCRIPTIONS } from '../../tests/subscriptions.fixtures.spec';
import { CategoryService } from '../core/category/category.service';
import { CATEGORY_DATA_WEB } from '../../tests/category.fixtures.spec';
import { SUBSCRIPTIONS } from '../../tests/subscriptions.fixtures.spec';
import { EventService } from '../core/event/event.service';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: UserService;
  let categoryService: CategoryService;
  let subscriptionsService: SubscriptionsService;
  let stripeService: StripeService;
  let featureflagService: FeatureflagService;
  let eventService: EventService;
  const mockMotorPlan = {
    type: 'motor_plan_pro',
    subtype: 'sub_premium'
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxPermissionsModule.forRoot()],
      declarations: [ ProfileComponent ],
      providers: [
        I18nService,
        EventService,
        {provide: HttpService, useValue: {}},
        {
          provide: UserService, useValue: {
            me() {
              return Observable.of(MOCK_USER);
            },
            getMotorPlan() {
              return Observable.of({
                motorPlan: mockMotorPlan
              });
            },
            isProUser() {
              return Observable.of({});
            },
            getStats() {
              return Observable.of(USERS_STATS_RESPONSE);
            },
            logout() {},
            getMotorPlans() {
              return Observable.of({});
            },
            isProfessional() {
              return Observable.of(false);
            }
          }
        },
        {
          provide: StripeService, useValue: {
            isPaymentMethodStripe$() {
              return Observable.of(true);
            }
          }
        },
        {
          provide: SubscriptionsService, useValue: {
            isSubscriptionsActive$() {
              return Observable.of(true);
            },
            getSubscriptions() {
              return Observable.of(MAPPED_SUBSCRIPTIONS)
            }
          }
        },
        {
          provide: FeatureflagService, useValue: {
            getFlag() {
              return Observable.of(true);
            }
          }
        },
        {
          provide: CategoryService, useValue: {
            getCategories() {
                return Observable.of(CATEGORY_DATA_WEB);
              }
            }
        },
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    categoryService = TestBed.get(CategoryService);
    eventService = TestBed.get(EventService);
    spyOn(userService, 'me').and.callThrough();
    spyOn(userService, 'isProUser').and.returnValue(Observable.of(true));
    spyOn(userService, 'getStats').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call userService.me', () => {
      component.ngOnInit();

      expect(userService.me).toHaveBeenCalled();
    });

    it('should set userUrl', () => {
      component.ngOnInit();

      expect(component.userUrl).toBe(environment.siteUrl.replace('es', 'www') + 'user/' + USER_WEB_SLUG);
    });

    it('should subscribe to getMotorPlan', () => {
      spyOn(userService, 'getMotorPlan').and.callThrough();

      component.ngOnInit();

      expect(userService.getMotorPlan).toHaveBeenCalled();
    });

    it('should set the translated user motor plan', () => {
      spyOn(userService, 'getMotorPlan').and.returnValue(Observable.of(MOTORPLAN_DATA));

      component.ngOnInit();

      expect(component.motorPlan).toEqual({subtype: 'sub_premium', label: 'Super Motor Plan', shortLabel: 'Super'});
    });

    it('should call userService.isProUser and set isPro', () => {
      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isPro).toBe(true);
    });

    it('should call userService.getStats and set stats', () => {
      expect(userService.getStats).toHaveBeenCalled();
      expect(component.userStats).toBe(USERS_STATS_RESPONSE);
    });

    it('should set isNewSubscription to true if the user is subscribed with stripe and not a Cardealer', () => {
      component.isNewSubscription = false;
      spyOn(categoryService, 'getCategories').and.callThrough();
      spyOn(userService, 'getMotorPlans').and.returnValue(Observable.of(PROFILE_NOT_SUB_INFO));

      component.ngOnInit();

      expect(component.isNewSubscription).toBe(true);
    });

  });

  describe('logout', () => {
    const preventDefault = jasmine.createSpy('preventDefault');
    const event = {preventDefault: preventDefault};

    beforeEach(() => {
      spyOn(userService, 'logout');
      component.logout(event);
    });

    it('should prevent event', () => {
      expect(preventDefault).toHaveBeenCalled();
    });

    it('should logout', () => {
      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
