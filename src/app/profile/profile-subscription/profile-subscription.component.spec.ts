import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSubscriptionComponent } from './profile-subscription.component';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../../shared/custom-currency/custom-currency.pipe';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { I18nService } from '../../core/i18n/i18n.service';

describe('ProfileSubscriptionComponent', () => {
  let component: ProfileSubscriptionComponent;
  let fixture: ComponentFixture<ProfileSubscriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileSubscriptionComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        I18nService,
        {
          provide: UserService, useValue: {
          getMotorPlans() {
            return Observable.of({
              product_group: {
                user_products: []
              }
            })
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
