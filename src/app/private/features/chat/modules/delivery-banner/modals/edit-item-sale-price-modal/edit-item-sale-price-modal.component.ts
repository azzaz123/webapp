import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

enum EDIT_ITEM_SALE_PRICE_ERROR {
  DEFAULT,
  MIN,
  MAX,
}
@Component({
  selector: 'tsl-edit-item-sale-price-modal',
  templateUrl: './edit-item-sale-price-modal.component.html',
  styleUrls: ['./edit-item-sale-price-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemSalePriceModalComponent implements OnInit {
  constructor(private formBuilder: FormBuilder, private activeModal: NgbActiveModal) {}

  public readonly MIN_ITEM_PRICE: number = 1;
  public readonly MAX_ITEM_PRICE: number = 1000;
  public readonly EDIT_ITEM_SALE_PRICE_ERROR = EDIT_ITEM_SALE_PRICE_ERROR;
  public newItemSalePriceForm: FormGroup;
  public isInvalidInput: boolean = false;
  public isButtonDisabled: boolean = true;
  public inputError: EDIT_ITEM_SALE_PRICE_ERROR | null;

  ngOnInit(): void {
    this.buildForm();
    this.attachListeners();
  }

  private attachListeners(): void {
    this.newPriceFormControl.valueChanges.subscribe(() => {
      this.inputError = null;
      this.isInvalidInput = false;
      this.checkDisabledButton();
    });
  }

  private buildForm(): void {
    this.newItemSalePriceForm = this.formBuilder.group({
      newPrice: [null, [Validators.required, Validators.min(this.MIN_ITEM_PRICE), Validators.max(this.MAX_ITEM_PRICE)]],
    });
  }

  public handleSubmit(): void {
    this.checkInputError();
    this.checkInvalidInput();
  }

  public handleClickCloseModal(): void {
    this.activeModal.close();
  }

  private get newPriceFormControl(): FormControl {
    return this.newItemSalePriceForm.get('newPrice') as FormControl;
  }

  private checkInvalidInput(): void {
    this.isInvalidInput = this.inputError !== null;
  }

  private checkDisabledButton(): void {
    this.isButtonDisabled = this.newPriceFormControl.errors?.required;
  }

  private checkInputError(): void {
    const isMinValueError: boolean = !!this.newPriceFormControl.errors?.min;
    const isMaxValueError: boolean = !!this.newPriceFormControl.errors?.max;

    if (isMinValueError) {
      this.inputError = EDIT_ITEM_SALE_PRICE_ERROR.MIN;
      return;
    }

    if (isMaxValueError) {
      this.inputError = EDIT_ITEM_SALE_PRICE_ERROR.MAX;
      return;
    }
  }
}
