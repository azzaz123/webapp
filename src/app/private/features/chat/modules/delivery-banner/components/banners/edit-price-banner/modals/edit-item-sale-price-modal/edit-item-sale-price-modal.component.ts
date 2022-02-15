import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { mapCurrencyCodeToCurrency, mapNumberAndCurrencyCodeToMoney } from '@api/core/mappers';
import { Currency, CurrencyCode, CurrencySymbol } from '@api/core/model/currency.interface';
import { Money } from '@api/core/model/money.interface';
import { ItemSalePriceApiService } from '@api/items/sale_price';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InboxItem } from '@private/features/chat/core/model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

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
  public loading: boolean = false;
  public isInvalidInput: boolean = false;
  public isButtonDisabled: boolean = true;
  public inputError: EDIT_ITEM_SALE_PRICE_ERROR | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private changeDetectorRef: ChangeDetectorRef,
    private activeModal: NgbActiveModal,
    private itemSalePriceApiService: ItemSalePriceApiService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.attachListeners();
    this.calculateErrorLiterals();
  }

  public handleSubmit(): void {
    this.checkVisualValidations();
    this.checkSubmit();
  }

  public handleClickCloseModal(): void {
    this.closeModal();
  }

  private attachListeners(): void {
    this.newPriceFormControl.valueChanges.subscribe(() => {
      this.resetVisualValidations();
      this.checkDisabledButton();
    });
  }

  private buildForm(): void {
    this.newItemSalePriceForm = this.formBuilder.group({
      newPrice: [null, [Validators.required, Validators.min(this.MIN_ITEM_PRICE), Validators.max(this.MAX_ITEM_PRICE)]],
    });
  }

  private closeModal(): void {
    this.activeModal.close();
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

  private resetVisualValidations(): void {
    this.inputError = null;
    this.isInvalidInput = false;
    this.changeDetectorRef.markForCheck();
  }

  private checkVisualValidations(): void {
    this.checkNewPriceErrors();
    this.checkInvalidInput();
    this.changeDetectorRef.markForCheck();
  }

  private checkInvalidInput(): void {
    this.isInvalidInput = this.inputError !== null;
  }

  private checkDisabledButton(): void {
    this.isButtonDisabled = !!this.newPriceFormControl.errors?.required || this.loading;
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

  private checkSubmit(): void {
    const isValidForm = this.newItemSalePriceForm.valid;
    if (isValidForm) {
      this.loading = true;

      this.generateRequestToApi().subscribe(
        () => {
          this.closeModal();
          this.updateItemPriceAmountByReference();
        },
        () => {
          this.inputError = EDIT_ITEM_SALE_PRICE_ERROR.DEFAULT;
          this.loading = false;
          this.checkVisualValidations();
        }
      );
    }
  }

  private get newPriceFromForm(): Money {
    const number: number = this.newPriceFormControl.value;
    const currency: CurrencyCode = this.currencyFromInboxItem.code;
    const money: Money = mapNumberAndCurrencyCodeToMoney({ number, currency });
    return money;
  }

  private generateRequestToApi(): Observable<void | never> {
    const newPrice: Money = this.newPriceFromForm;
    const { id: itemHash } = this.item;
    return this.itemSalePriceApiService.update(itemHash, newPrice).pipe(take(1));
  }

  private updateItemPriceAmountByReference(): void {
    const newPrice: Money = this.newPriceFromForm;
    const { amount } = newPrice;
    this.item.price.amount = amount.total;
  }
}
