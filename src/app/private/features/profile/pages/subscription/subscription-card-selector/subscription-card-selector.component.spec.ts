import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FINANCIAL_CARD } from '@fixtures/payments.fixtures.spec';
import { CARDS_WITH_ONE_DEFAULT, STRIPE_CARD_OPTION } from '@fixtures/stripe.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChangeCardModalComponent } from '@shared/modals/change-card-modal/change-card-modal.component';
import { NewCardModalComponent } from '@shared/modals/new-card-modal/new-card-modal.component';

import { SubscriptionCardSelectorComponent } from './subscription-card-selector.component';

describe('SubscriptionCardSelectorComponent', () => {
  let component: SubscriptionCardSelectorComponent;
  let fixture: ComponentFixture<SubscriptionCardSelectorComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubscriptionCardSelectorComponent],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve(FINANCIAL_CARD),
              };
            },
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionCardSelectorComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  describe('Click new card', () => {
    beforeEach(() => {
      spyOn(component.clickNewCard, 'emit');
    });

    it('should emit event', () => {
      component.onAddCard();
      expect(component.clickNewCard.emit).toHaveBeenCalledTimes(1);
      expect(component.clickNewCard.emit).toHaveBeenCalledWith();
    });

    describe('and add a card', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(component.changeSelectedCard, 'emit').and.callThrough();
      });

      it('should open modal', () => {
        component.onAddCard();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(NewCardModalComponent, { windowClass: 'review' });
      });

      it('should change card', fakeAsync(() => {
        component.onAddCard();
        tick();

        expect(component.changeSelectedCard.emit).toHaveBeenCalledTimes(1);
        expect(component.changeSelectedCard.emit).toHaveBeenLastCalledWith(FINANCIAL_CARD);
      }));
    });

    describe('and not add a card', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.reject(),
        });
        spyOn(component.changeSelectedCard, 'emit').and.callThrough();
      });

      it('should open modal', () => {
        component.onAddCard();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(NewCardModalComponent, { windowClass: 'review' });
      });

      it('should change card', fakeAsync(() => {
        component.onAddCard();
        tick();

        expect(component.changeSelectedCard.emit).not.toHaveBeenCalled();
      }));
    });
  });
  describe('Click change card', () => {
    describe('and change card', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.callThrough();
        spyOn(component.changeSelectedCard, 'emit').and.callThrough();
      });

      it('should open modal', () => {
        component.onChangeCard();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(ChangeCardModalComponent, { windowClass: 'review' });
      });

      it('should change card', fakeAsync(() => {
        component.onChangeCard();
        tick();

        expect(component.changeSelectedCard.emit).toHaveBeenCalledTimes(1);
        expect(component.changeSelectedCard.emit).toHaveBeenLastCalledWith(FINANCIAL_CARD);
      }));
    });

    describe('and not add a card', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({
          result: Promise.reject(),
          componentInstance: {},
        });
        spyOn(component.changeSelectedCard, 'emit').and.callThrough();
      });

      it('should open modal', () => {
        component.onChangeCard();

        expect(modalService.open).toHaveBeenCalledTimes(1);
        expect(modalService.open).toHaveBeenCalledWith(ChangeCardModalComponent, { windowClass: 'review' });
      });

      it('should change card', fakeAsync(() => {
        component.onChangeCard();
        tick();

        expect(component.changeSelectedCard.emit).not.toHaveBeenCalled();
      }));
    });
  });
  describe('show change card', () => {
    describe('has more than a stripe card', () => {
      it('should show link', () => {
        component.stripeCards = CARDS_WITH_ONE_DEFAULT;
        component.showChangeLink = false;
        component.ngOnChanges();

        expect(component.showChangeLink).toBe(true);
      });
    });
    describe('has one stripe card', () => {
      describe('and is not the selected card', () => {
        it('should show link', () => {
          component.stripeCards = [CARDS_WITH_ONE_DEFAULT[0]];
          component.selectedCard = CARDS_WITH_ONE_DEFAULT[1];
          component.showChangeLink = false;
          component.ngOnChanges();

          expect(component.showChangeLink).toBe(true);
        });
      });
      describe('and is the selected card', () => {
        it('should not show link', () => {
          component.stripeCards = [CARDS_WITH_ONE_DEFAULT[0]];
          component.selectedCard = CARDS_WITH_ONE_DEFAULT[0];
          component.showChangeLink = false;
          component.ngOnChanges();

          expect(component.showChangeLink).toBe(false);
        });
      });
    });
  });
});
