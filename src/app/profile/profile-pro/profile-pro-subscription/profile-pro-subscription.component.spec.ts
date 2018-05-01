import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProSubscriptionComponent } from './profile-pro-subscription.component';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { createPacksModelFixture, PACK_RESPONSE } from '../../../../tests/payments.fixtures.spec';
import { PacksModel, PerksModel } from '../../../core/payments/payment.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProfileProSubscriptionComponent', () => {
  let component: ProfileProSubscriptionComponent;
  let fixture: ComponentFixture<ProfileProSubscriptionComponent>;
  let paymentsService: PaymentService;
  const packsModel: PacksModel = createPacksModelFixture();
  const perksModel: PerksModel = new PerksModel();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProSubscriptionComponent ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getPerks() {
            return Observable.of(perksModel)
          },
          getSubscriptionPacks() {
            return Observable.of(packsModel)
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProSubscriptionComponent);
    component = fixture.componentInstance;
    paymentsService = TestBed.get(PaymentService);
    spyOn(paymentsService, 'getSubscriptionPacks').and.callThrough();
    spyOn(paymentsService, 'getPerks').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getSubscriptionPacks and set packs', () => {
      expect(paymentsService.getSubscriptionPacks).toHaveBeenCalled();
      expect(component.packs).toEqual(packsModel);
    });

    it('should call getPerks and set perks', () => {
      expect(paymentsService.getPerks).toHaveBeenCalled();
      expect(component.perks).toEqual(perksModel);
    });
  });
});
