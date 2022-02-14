import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ItemSalePriceApiService } from '@api/items/sale_price';
import { MOCK_INBOX_CONVERSATION_AS_SELLER } from '@fixtures/chat';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { of } from 'rxjs';

import { EditItemSalePriceModalComponent, EDIT_ITEM_SALE_PRICE_ERROR } from './edit-item-sale-price-modal.component';

describe('EditItemSalePriceModalComponent', () => {
  let component: EditItemSalePriceModalComponent;
  let fixture: ComponentFixture<EditItemSalePriceModalComponent>;
  let activeModal: NgbActiveModal;
  let submitButtonElement: DebugElement;
  let spyOnHandleSubmit: jasmine.Spy;
  let cd: ChangeDetectorRef;

  const closeButtonSelector: string = '.EditItemSalePriceModal__close';
  const inputErrorSelector: string = '.EditItemSalePriceModal__newPriceInputError > span';
  const submitButtonSelector: string = 'button';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule],
      declarations: [EditItemSalePriceModalComponent, ButtonComponent],
      providers: [
        FormBuilder,
        { provide: NgbActiveModal, useValue: { close: () => {} } },
        { provide: ItemSalePriceApiService, useValue: { update: () => of({}) } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditItemSalePriceModalComponent);
    cd = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    activeModal = TestBed.inject(NgbActiveModal);
    component = fixture.componentInstance;
    component.item = MOCK_INBOX_CONVERSATION_AS_SELLER.item;
    fixture.detectChanges();

    spyOnHandleSubmit = spyOn(component, 'handleSubmit').and.callThrough();
    submitButtonElement = fixture.debugElement.query(By.css(submitButtonSelector));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when user clicks on close modal', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
      const closeButtonElement: DebugElement = fixture.debugElement.query(By.css(closeButtonSelector));
      closeButtonElement.nativeElement.click();
    });

    it('should close the modal', () => {
      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });
  });

  describe('when user inputs a price below the minimum', () => {
    beforeEach(() => modifyPriceInput(0.25));

    describe('and when user submits the form', () => {
      beforeEach(() => submitForm());

      afterEach(() => {
        spyOnHandleSubmit.calls.reset();
      });

      it('should handle the submit', async () => {
        expect(component.handleSubmit).toHaveBeenCalledTimes(1);
      });

      it('should show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeTruthy();
      });

      it('should be minimum price error type', () => {
        expect(component.inputError).toBe(EDIT_ITEM_SALE_PRICE_ERROR.MIN);
      });
    });
  });

  describe('when user inputs a price over the maximum', () => {
    beforeEach(() => modifyPriceInput(288288));

    describe('and when user submits the form', () => {
      beforeEach(() => submitForm());

      it('should show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeTruthy();
      });

      it('should be minimum price error type', () => {
        expect(component.inputError).toBe(EDIT_ITEM_SALE_PRICE_ERROR.MAX);
      });
    });
  });

  describe('and when user inputs a valid price', () => {
    beforeEach(() => modifyPriceInput(420));

    describe('and when user submits the form', () => {
      beforeEach(() => submitForm());

      it('should NOT show an error in the UI', () => {
        const inputErrorElement: DebugElement = fixture.debugElement.query(By.css(inputErrorSelector));

        expect(inputErrorElement).toBeFalsy();
      });
    });
  });

  const modifyPriceInput: Function = (validPrice: number) => {
    component.newItemSalePriceForm.controls['newPrice'].patchValue(validPrice);
    cd.markForCheck();
    fixture.detectChanges();
  };

  const submitForm: Function = () => {
    submitButtonElement.nativeElement.click();
    cd.markForCheck();
    fixture.detectChanges();
  };
});
