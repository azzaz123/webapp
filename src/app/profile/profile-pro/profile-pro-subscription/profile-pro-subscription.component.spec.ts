import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProSubscriptionComponent } from './profile-pro-subscription.component';
import { PaymentService } from '../../../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { PACK_RESPONSE, createPacksFixture } from '../../../../tests/payments.fixtures.spec';
import { PerksModel } from '../../../core/payments/payment.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VisibilityProductsModalComponent } from './visibility-products-modal/visibility-products-modal.component';
import { SubscriptionIconPipe } from './subscription-icon.pipe';
import { Packs } from '../../../core/payments/payment.interface';

describe('ProfileProSubscriptionComponent', () => {
  let component: ProfileProSubscriptionComponent;
  let fixture: ComponentFixture<ProfileProSubscriptionComponent>;
  let paymentsService: PaymentService;
  let modalService: NgbModal;
  const packs: Packs = createPacksFixture();
  const perksModel: PerksModel = new PerksModel();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProSubscriptionComponent, SubscriptionIconPipe ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getPerks() {
            return Observable.of(perksModel);
          },
          getSubscriptionPacks() {
            return Observable.of(packs);
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {}
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProSubscriptionComponent);
    component = fixture.componentInstance;
    paymentsService = TestBed.get(PaymentService);
    modalService = TestBed.get(NgbModal);
    spyOn(paymentsService, 'getSubscriptionPacks').and.callThrough();
    spyOn(paymentsService, 'getPerks').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getSubscriptionPacks and set packs', () => {
      expect(paymentsService.getSubscriptionPacks).toHaveBeenCalled();
      expect(component.packs).toEqual(packs);
    });

    it('should call getPerks and set perks', () => {
      expect(paymentsService.getPerks).toHaveBeenCalled();
      expect(component.perks).toEqual(perksModel);
    });
  });

  describe('openVisibilityProductsModal', () => {
    it('should open modal', () => {
      spyOn(modalService, 'open');

      component.openVisibilityProductsModal();

      expect(modalService.open).toHaveBeenCalledWith(VisibilityProductsModalComponent, {windowClass: 'visibility-products'});
    });
  });
});
