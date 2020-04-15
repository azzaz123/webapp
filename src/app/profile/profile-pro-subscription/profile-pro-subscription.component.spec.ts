import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProSubscriptionComponent } from './profile-pro-subscription.component';
import { Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SubscriptionIconPipe } from './subscription-icon.pipe';
import { Router } from '@angular/router';
import { PaymentService } from '../../core/payments/payment.service';
import { Packs } from '../../core/payments/payment.interface';
import { createPacksFixture } from '../../../tests/payments.fixtures.spec';
import { PerksModel } from '../../core/payments/payment.model';

describe('ProfileProSubscriptionComponent', () => {
  let component: ProfileProSubscriptionComponent;
  let fixture: ComponentFixture<ProfileProSubscriptionComponent>;
  let paymentsService: PaymentService;
  let modalService: NgbModal;
  let router: Router;
  const packs: Packs = createPacksFixture();
  const perksModel: PerksModel = new PerksModel();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileProSubscriptionComponent, SubscriptionIconPipe ],
      providers: [
        {
          provide: PaymentService, useValue: {
          getPerks() {
            return of(perksModel);
          },
          getSubscriptionPacks() {
            return of(packs);
          }
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {}
        }
        },
        {
          provide: Router, useValue: {
          navigate() {
          }
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
    router = TestBed.get(Router);
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

  describe('openFaqs', () => {
    it('should redirect to the faqs', () => {
      spyOn(router, 'navigate');

      component.openFaqs();

      expect(router.navigate).toHaveBeenCalledWith(['pro/help', {section: 'Perfil-6'}]);
    });
  });
});
