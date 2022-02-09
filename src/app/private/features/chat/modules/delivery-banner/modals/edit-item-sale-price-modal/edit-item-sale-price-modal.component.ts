import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tsl-edit-item-sale-price-modal',
  templateUrl: './edit-item-sale-price-modal.component.html',
  styleUrls: ['./edit-item-sale-price-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditItemSalePriceModalComponent implements OnInit {
  constructor(private formBuilder: FormBuilder) {}

  public newItemSalePriceForm: FormGroup;
  public isInvalidInput: boolean = false;
  public isButtonDisabled: boolean = true;

  private readonly MIN_ITEM_PRICE: number = 1;
  private readonly MAX_ITEM_PRICE: number = 1000;

  ngOnInit(): void {
    this.buildForm();
    this.attachListeners();
  }

  private attachListeners(): void {
    this.newPriceFormControl.valueChanges.subscribe(() => this.updateButtonDisabledStyles());
  }

  private buildForm(): void {
    this.newItemSalePriceForm = this.formBuilder.group({
      newPrice: [null, [Validators.required, Validators.min(this.MIN_ITEM_PRICE), Validators.max(this.MAX_ITEM_PRICE)]],
    });
  }

  public handleSubmit(): void {
    this.updateInputValidationStyles();
  }

  private get newPriceFormControl(): FormControl {
    return this.newItemSalePriceForm.get('newPrice') as FormControl;
  }

  private updateInputValidationStyles(): void {
    this.isInvalidInput = !!this.newPriceFormControl.errors;
  }

  private updateButtonDisabledStyles(): void {
    this.isButtonDisabled = this.newPriceFormControl.errors?.required;
  }
}
