import { async, ComponentFixture, fakeAsync, tick, TestBed } from '@angular/core/testing';

import { CreditCardInfoComponent } from './credit-card-info.component';
import { of } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { createFinancialCardFixture, STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';
import { delay, finalize } from 'rxjs/operators';
import { PaymentService } from '../../../core/payments/payment.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpService } from '../../../core/http/http.service';
import { UserService } from '../../../core/user/user.service';

fdescribe('CreditCardInfoComponent', () => {
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
            }
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
    stripeService = TestBed.get(StripeService);
    modalService = TestBed.get(NgbModal);
    component.financialCard = STRIPE_CARD_OPTION;
  });

  fdescribe('deleteStripeCreditCard', () => {
    beforeEach(() => deleteStripeCardButton = fixture.debugElement.nativeElement.querySelector('a'));

    it('should open modal when clicking in add more cards button', fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(component.onDeleteStripeCard, 'emit');

      deleteStripeCardButton.click();
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        windowClass: 'modal-prompt'
      });
      expect(componentInstance.type).toBe(4);
      expect(component.onDeleteStripeCard.emit).toHaveBeenCalledWith(STRIPE_CARD_OPTION);
    }));

    it('should ask to Stripe backend to delete the card', fakeAsync(() => {
      spyOn(stripeService, 'deleteCard').and.callThrough();

      deleteStripeCardButton.click();
      tick();

      expect(stripeService.deleteCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    }));

    it('should show a loading component while waiting backend response', fakeAsync(() => {
      const backendResponseTimeMs = 3000;
      spyOn(stripeService, 'deleteCard').and.returnValue(of().pipe(delay(backendResponseTimeMs)));
      
      deleteStripeCardButton.click();
      tick();
      fixture.detectChanges();

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('.CreditCard__info--loading > mat-icon');
      expect(loadingComponent).toBeTruthy();
      expect(loadingComponent.getAttribute('svgicon')).toBe('spinner');
      tick(backendResponseTimeMs);
    }));

    it('should hide the loading component when backend answered', fakeAsync(() => {
      const backendResponseTimeMs = 3000;
      spyOn(stripeService, 'deleteCard').and.returnValue(of().pipe(delay(backendResponseTimeMs)));
      
      deleteStripeCardButton.click();
      tick(backendResponseTimeMs + 1);

      const loadingComponent: HTMLElement = fixture.nativeElement.querySelector('.CreditCard__info--loading');
      expect(loadingComponent).toBeFalsy();
    }));
  });
});
