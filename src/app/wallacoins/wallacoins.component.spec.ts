import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { WallacoinsComponent } from './wallacoins.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CustomCurrencyPipe } from '../shared/pipes';
import { PaymentService } from '../core/payments/payment.service';
import { Observable, of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { PerksModel } from '../core/payments/payment.model';
import {
  createPerksModelFixture,
  createWallacoinsPacksFixture,
  WALLACREDITS_PACKS_RESPONSE
} from '../../tests/payments.fixtures.spec';
import { CREDITS_PACK_ID, Pack } from '../core/payments/pack';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { EventService } from '../core/event/event.service';
import { MockTrackingService } from '../../tests/tracking.fixtures.spec';
import { TrackingService } from '../core/tracking/tracking.service';
import { UserService } from '../core/user/user.service';
import { MOCK_USER, USER_ID } from '../../tests/user.fixtures.spec';
import { WallacoinsTutorialComponent } from './wallacoins-tutorial/wallacoins-tutorial.component';
import Spy = jasmine.Spy;

describe('WallacoinsComponent', () => {
  let component: WallacoinsComponent;
  let fixture: ComponentFixture<WallacoinsComponent>;
  let paymentService: PaymentService;
  let modalService: NgbModal;
  let router: Router;
  let eventService: EventService;
  let userService: UserService;
  const CREDITS_PACKS: Pack[] = createWallacoinsPacksFixture().wallacoins;
  const PERKS: PerksModel = createPerksModelFixture();
  const PACK = new Pack(
    WALLACREDITS_PACKS_RESPONSE[0].id,
    WALLACREDITS_PACKS_RESPONSE[0].benefits[CREDITS_PACK_ID],
    +WALLACREDITS_PACKS_RESPONSE[0].price,
    WALLACREDITS_PACKS_RESPONSE[0].currency,
    'wallacredits'
  );
  let localStorageSpy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WallacoinsComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        EventService,
        UserService,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: PaymentService, useValue: {
          getCreditsPacks() {
            return of(CREDITS_PACKS);
          },
          getPerks() {
            return of(PERKS);
          }
        }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve('success')
              }
            }
        }
        },
        {
          provide: Router, useValue: {
            navigate() {
            }
        }
        },
        {
          provide: ActivatedRoute, useValue: {
            params: of({
              code: '-1'
            })
        }
        },
        {
          provide: UserService, useValue: {
            user: MOCK_USER,
            isProfessional() {
              return of('')
            },
            me() {
              return of({})
            }
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsComponent);
    component = fixture.componentInstance;
    localStorageSpy = spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(PACK));
    fixture.detectChanges();
    paymentService = TestBed.get(PaymentService);
    modalService = TestBed.get(NgbModal);
    router = TestBed.get(Router);
    eventService = TestBed.get(EventService);
  });

  describe('ngOnInit', () => {

    it('should call getCreditsPacks and set packs', () => {
      spyOn(paymentService, 'getCreditsPacks').and.callThrough();

      component.ngOnInit();

      expect(component.packs).toEqual(CREDITS_PACKS);
      expect(component.currencyName).toBe('wallacoins');
      expect(component.factor).toBe(100);
    });

    it('should call getPerks, set perks and emit event', () => {
      spyOn(paymentService, 'getPerks').and.callThrough();
      spyOn(eventService, 'emit');

      component.ngOnInit();

      expect(component.wallacoins).toEqual(PERKS.wallacoins.quantity);
      expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED, PERKS.wallacoins.quantity);
    });

    it('should open modal if there is param.code', () => {
      spyOn(localStorage, 'removeItem');
      spyOn<any>(component, 'openConfirmModal');

      component.ngOnInit();

      expect(localStorage.getItem).toHaveBeenCalledWith('pack');
      expect(localStorage.removeItem).toHaveBeenCalledWith('transactionType');
      expect(localStorage.removeItem).toHaveBeenCalledWith('pack');
      expect(component['openConfirmModal']).toHaveBeenCalledWith(PACK, '-1');
    });

    it('should call openTutorialModal', () => {
      spyOn<any>(component, 'openTutorialModal');

      component.ngOnInit();

      expect(component['openTutorialModal']).toHaveBeenCalled();
    });

  });

  describe('openBuyModal', () => {
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(paymentService, 'getPerks').and.callThrough();
      spyOn(router, 'navigate');
      spyOn(eventService, 'emit');

      component.openBuyModal(CREDITS_PACKS[0], 1);
    }));

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(BuyWallacoinsModalComponent, {windowClass: 'modal-standard'});
    });

    it('should open second modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(WallacoinsConfirmModalComponent, {windowClass: 'confirm-wallacoins'});
    });

    it('should redirect to catalog', () => {
      expect(router.navigate).toHaveBeenCalledWith(['catalog/list']);
    });

    it('should emit TOTAL_CREDITS_UPDATED if response is success', () => {
      expect(eventService.emit).toHaveBeenCalledWith(EventService.TOTAL_CREDITS_UPDATED, component.wallacoins);
    });
  });

  describe('openTutorialModal', () => {
    it('should open modal if not displayed and set localStorage', () => {
      localStorageSpy.and.returnValue(null);
      spyOn(localStorage, 'setItem');
      spyOn(modalService, 'open');

      component['openTutorialModal']();

      expect(modalService.open).toHaveBeenCalledWith(WallacoinsTutorialComponent, {windowClass: 'tutorial-wallacoins'});
      expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '-wallacoins-tutorial', 'true');
    });
  });
});
