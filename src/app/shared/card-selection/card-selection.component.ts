import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { PaymentService } from '../../core/payments/payment.service';
import { FinancialCard } from '../../core/payments/payment.interface';

@Component({
  selector: 'tsl-card-selection',
  templateUrl: './card-selection.component.html',
  styleUrls: ['./card-selection.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CardSelectionComponent),
      multi: true,
    },
  ],
})
export class CardSelectionComponent implements OnInit, ControlValueAccessor {

  private _model: boolean = false;
  public financialCard: FinancialCard;
  @Output() hasCard: EventEmitter<boolean> = new EventEmitter<boolean>();

  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private paymentService: PaymentService) { }

  ngOnInit() {
    this.paymentService.getFinancialCard().subscribe((financialCard: FinancialCard) => {
      this.financialCard = financialCard;
      this.hasCard.emit(!!this.financialCard);
    });
  }

  public get model(): boolean {
    return this._model;
  }

  public set model(val: boolean) {
    this._model = val;
    this.onModelChange(val);
    this.onTouched();
  }

  public registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  public writeValue(value: boolean): void {
    this.model = value;
  }

  public registerOnTouched(fn: Function): void {
    this.onTouched = fn;
  }

}
