import { async, ComponentFixture, fakeAsync, tick, TestBed } from '@angular/core/testing';

import { CreditCardInfoComponent } from './credit-card-info.component';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { STRIPE_CARD_OPTION, STRIPE_CARD_OPTION_SUBSCRIPTION } from '../../../../tests/stripe.fixtures.spec';
import { delay } from 'rxjs/operators';
import { NoCardModalComponent } from 'app/shared/modals/no-card-modal/no-card-modal.component';

describe('CreditCardInfoComponent', () => {
  let component: CreditCardInfoComponent;
  let fixture: ComponentFixture<CreditCardInfoComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  let deleteStripeCardButton;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardInfoComponent],
      providers: [
        I18nService,
        {
          provide: StripeService, useValue: {
            deleteCard() {
              return of({});
            }
          }
        },
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              }
            },
            close() {
            },
          },
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stripeService = TestBed.inject(StripeService);
    modalService = TestBed.inject(NgbModal);
    component.financialCard = STRIPE_CARD_OPTION;
  });

  describe('checkDelete', () => {
    beforeEach(() =>  {
      deleteStripeCardButton = fixture.debugElement.nativeElement.querySelector('.CreditCard__info--actions-delete');
      component.financialCard = STRIPE_CARD_OPTION_SUBSCRIPTION;
    });
    it('should open NoCardModalComponent modal if card is default', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      
      deleteStripeCardButton.click();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(NoCardModalComponent, {
        windowClass: 'review'
      });
    }));

    it('should call deleteCard', fakeAsync(() => {
      spyOn(modalService, 'open').and.returnValue({
        result: Promise.resolve('deleteCardModal'),
        componentInstance: componentInstance
      });
      spyOn(component, 'deleteStripeCard').and.callThrough();
      component.financialCard = STRIPE_CARD_OPTION;

      deleteStripeCardButton.click();
      tick();

      expect(component.deleteStripeCard).toHaveBeenCalled();
    }));
  });

  describe('deleteStripeCreditCard', () => {
    it('should open modal when clicking in add more cards button', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component.onDeleteStripeCard, 'emit');

      component.deleteStripeCard();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        windowClass: 'modal-prompt'
      });
      expect(componentInstance.type).toBe(4);
      expect(component.onDeleteStripeCard.emit).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    }));

    it('should ask to Stripe backend to delete the card', fakeAsync(() => {
      spyOn(stripeService, 'deleteCard').and.callThrough();

      component.deleteStripeCard();
      tick();

      expect(stripeService.deleteCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    }));

    it('should show a loading component while waiting backend response', fakeAsync(() => {
      const backendResponseTimeMs = 3000;
      spyOn(stripeService, 'deleteCard').and.returnValue(of().pipe(delay(backendResponseTimeMs)));

      component.deleteStripeCard();
      tick();
      fixture.detectChanges();

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('.CreditCard__info--loading > tsl-svg-icon');
      expect(loadingComponent).toBeTruthy();
      expect(loadingComponent.getAttribute('src')).toContain('spinner');
      tick(backendResponseTimeMs);
    }));

    it('should hide the loading component when backend answered', fakeAsync(() => {
      const backendResponseTimeMs = 3000;
      spyOn(stripeService, 'deleteCard').and.returnValue(of().pipe(delay(backendResponseTimeMs)));

      tick(backendResponseTimeMs + 1);

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('.CreditCard__info--loading');
      expect(loadingComponent).toBeFalsy();
    }));
  });
});
