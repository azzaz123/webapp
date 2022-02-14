import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { mapCurrencyCodeToCurrency } from '@api/core/mappers';
import { Currency, CurrencyCode, CurrencySymbol } from '@api/core/model/currency.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxItem } from '@private/features/chat/core/model';

export enum EDIT_ITEM_SALE_PRICE_ERROR {
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
  @Input() item: InboxItem;

  public readonly MIN_ITEM_PRICE: number = 1;
  public readonly MAX_ITEM_PRICE: number = 1000;
  public readonly EDIT_ITEM_SALE_PRICE_ERROR = EDIT_ITEM_SALE_PRICE_ERROR;
  public MIN_ITEM_PRICE_WITH_CURRENCY: string;
  public MAX_ITEM_PRICE_WITH_CURRENCY: string;
  public newItemSalePriceForm: FormGroup;
  public isInvalidInput: boolean = false;
  public isButtonDisabled: boolean = true;
  public inputError: EDIT_ITEM_SALE_PRICE_ERROR | null = null;

  constructor(private formBuilder: FormBuilder, private activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.buildForm();
    this.attachListeners();
    this.calculateErrorLiterals();
  }

  public handleSubmit(): void {
    this.checkNewPriceErrors();
    this.checkInvalidInput();
  }

  public handleClickCloseModal(): void {
    this.activeModal.close();
  }

  private attachListeners(): void {
    this.newPriceFormControl.valueChanges.subscribe(() => {
      this.resetValidations();
      this.checkDisabledButton();
    });
  }

  private buildForm(): void {
    this.newItemSalePriceForm = this.formBuilder.group({
      newPrice: [null, [Validators.required, Validators.min(this.MIN_ITEM_PRICE), Validators.max(this.MAX_ITEM_PRICE)]],
    });
  }

  private calculateErrorLiterals(): void {
    const currency: Currency = this.currencyFromInboxItem;
    const currencySymbol: CurrencySymbol = currency.symbol;
    this.MIN_ITEM_PRICE_WITH_CURRENCY = `${this.MIN_ITEM_PRICE}${currencySymbol}`;
    this.MAX_ITEM_PRICE_WITH_CURRENCY = `${this.MAX_ITEM_PRICE}${currencySymbol}`;
  }

  private get newPriceFormControl(): FormControl {
    return this.newItemSalePriceForm.get('newPrice') as FormControl;
  }

  private get currencyFromInboxItem(): Currency {
    const { currency: currencyCode } = this.item.price;
    return mapCurrencyCodeToCurrency(currencyCode as CurrencyCode);
  }

  private resetValidations(): void {
    this.inputError = null;
    this.isInvalidInput = false;
  }

  private checkInvalidInput(): void {
    this.isInvalidInput = this.inputError !== null;
  }

  private checkDisabledButton(): void {
    this.isButtonDisabled = !!this.newPriceFormControl.errors?.required;
  }

  private checkNewPriceErrors(): void {
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
