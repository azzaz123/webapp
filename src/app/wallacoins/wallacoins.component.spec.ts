import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { WallacoinsComponent } from './wallacoins.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../shared/custom-currency/custom-currency.pipe';
import { PaymentService } from '../core/payments/payment.service';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { PerksModel } from '../core/payments/payment.model';
import { createPerksModelFixture, createWallacoinsPacksFixture } from '../../tests/payments.fixtures.spec';
import { Pack } from '../core/payments/pack';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';

describe('WallacoinsComponent', () => {
  let component: WallacoinsComponent;
  let fixture: ComponentFixture<WallacoinsComponent>;
  let paymentService: PaymentService;
  let modalService: NgbModal;
  let router: Router;
  const CREDITS_PACKS: Pack[][] = [createWallacoinsPacksFixture().wallacoins];
  const PERKS: PerksModel = createPerksModelFixture();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: PaymentService, useValue: {
          getCoinsCreditsPacks() {
            return Observable.of(CREDITS_PACKS);
          },
          getPerks() {
            return Observable.of(PERKS);
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve()
              }
            }
        }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    modalService = TestBed.get(NgbModal);
    router = TestBed.get(Router);
  });

  describe('ngOnInit', () => {
    it('should call getCoinsCreditsPacks and set packs', () => {
      spyOn(paymentService, 'getCoinsCreditsPacks').and.callThrough();

      component.ngOnInit();

      expect(component.packs).toEqual(CREDITS_PACKS);
      expect(component.currencyName).toBe('wallacoins');
      expect(component.factor).toBe(100);
    });

    it('should call getPerks and set perks', () => {
      spyOn(paymentService, 'getPerks').and.callThrough();

      component.ngOnInit();

      expect(component.wallacoins).toEqual(PERKS.wallacoins.quantity);
    });
  });

  describe('openBuyModal', () => {

    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(paymentService, 'getPerks').and.callThrough();
      spyOn(router, 'navigate');

      component.openBuyModal(CREDITS_PACKS[0][0]);
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(BuyWallacoinsModalComponent, {windowClass: 'buy-wallacoins'});
    });

    it('should call getPerks', () => {
      expect(paymentService.getPerks).toHaveBeenCalledWith(false);
    });

    it('should open second modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(WallacoinsConfirmModalComponent, {windowClass: 'confirm-wallacoins'});
    });

    it('should redirect to catalog', () => {
      expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
    });
  });
});
