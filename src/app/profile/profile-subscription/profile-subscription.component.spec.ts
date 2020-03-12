import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSubscriptionComponent } from './profile-subscription.component';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../shared/pipes';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs';
import { I18nService } from '../../core/i18n/i18n.service';
import { PROFILE_SUB_INFO } from '../../../tests/user.fixtures.spec';

describe('ProfileSubscriptionComponent', () => {
  let component: ProfileSubscriptionComponent;
  let fixture: ComponentFixture<ProfileSubscriptionComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSubscriptionComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        I18nService,
        {
          provide: UserService, useValue: {
          getMotorPlans() {
            return Observable.of(PROFILE_SUB_INFO);
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSubscriptionComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    spyOn(userService, 'getMotorPlans').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {

    it('should call getMotorPlans', () => {
      expect(userService.getMotorPlans).toHaveBeenCalled();
    });

    it('should set plans with new name and features names', () => {
      expect(component.plans.length).toBe(PROFILE_SUB_INFO.product_group.user_products.length);
      expect(component.plans[0].label).toBe('Basic');
      expect(component.plans[0].durations[0].features[0].label).toBe('Upload 5 cars.');
    });

    it('should set current plan name', () => {
      expect(component.currentPlan).toBe('Basic Motor Plan');
    });
  });
});
