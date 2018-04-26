import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProSubscriptionComponent } from './profile-pro-subscription.component';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { createPacksModelFixture } from '../../../../tests/payments.fixtures.spec';
import { PacksModel } from '../../../core/payments/payment.model';

describe('ProfileProSubscriptionComponent', () => {
  let component: ProfileProSubscriptionComponent;
  let fixture: ComponentFixture<ProfileProSubscriptionComponent>;
  let paymentsService: PaymentService;
  const packsModel: PacksModel = createPacksModelFixture();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProSubscriptionComponent ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getPacks() {
            return Observable.of(packsModel)
          }
        }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProSubscriptionComponent);
    component = fixture.componentInstance;
    paymentsService = TestBed.get(PaymentService);
    spyOn(paymentsService, 'getSubscriptionPacks').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getSubscriptionPacks and set packs', () => {
      expect(paymentsService.getSubscriptionPacks).toHaveBeenCalled();
      expect(component.packs).toEqual(packsModel);
    });
  });
});
