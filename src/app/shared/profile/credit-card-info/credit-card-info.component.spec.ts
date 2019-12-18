import { async, ComponentFixture, fakeAsync, tick, TestBed } from '@angular/core/testing';

import { CreditCardInfoComponent } from './credit-card-info.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ConfirmationModalComponent } from '../../confirmation-modal/confirmation-modal.component';
import { StripeService } from '../../../core/stripe/stripe.service';
import { I18nService } from '../../../core/i18n/i18n.service';
import { createFinancialCardFixture, STRIPE_CARD_OPTION } from '../../../../tests/stripe.fixtures.spec';

describe('CreditCardInfoComponent', () => {
  let component: CreditCardInfoComponent;
  let fixture: ComponentFixture<CreditCardInfoComponent>;
  let stripeService: StripeService;
  let modalService: NgbModal;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardInfoComponent],
      providers: [
        I18nService,
        {
          provide: NgbModal, useValue: {
            open() {
              return {
                result: Promise.resolve(),
                componentInstance: componentInstance
              }
            }
        }
        },
        {
          provide: StripeService, useValue: {
            deleteCard() {
              return Observable.of({})
            }
        }
        },
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

  describe('deleteStripeCreditCard', () => {
    let deleteStripeCardButton;
    const event = new MouseEvent('click');
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(stripeService, 'deleteCard').and.callThrough();
      spyOn(component.onDeleteStripeCard, 'emit');
      spyOn(event, 'preventDefault');
      deleteStripeCardButton = fixture.debugElement.nativeElement.querySelector('a');
      deleteStripeCardButton.click();
    }));

    it('should open modal', fakeAsync(() => {
      component.deleteStripeCard(event);
      tick();

      expect(modalService.open).toHaveBeenCalledWith(ConfirmationModalComponent, {
        windowClass: 'modal-prompt'
      });
      expect(componentInstance.type).toBe(4);
      expect(component.onDeleteStripeCard.emit).toHaveBeenCalledWith(createFinancialCardFixture());
    }));

    it('should call deleteCard and rest card', fakeAsync(() => {
      component.deleteStripeCard(event);
      tick();

      expect(stripeService.deleteCard).toHaveBeenCalled();
      expect(component.financialCard).toBeNull();
    }));
  });
});
