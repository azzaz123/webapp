import { Component, EventEmitter, forwardRef, OnInit, Output } from '@angular/core';
import { FinancialCard } from '../../../core/payments/payment.interface';
import { StripeService } from '../../../core/stripe/stripe.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '../../../core/errors/errors.service';
import { IOption } from 'ng-select';

@Component({
  selector: 'tsl-stripe-card-selection',
  templateUrl: './stripe-card-selection.component.html',
  styleUrls: ['./stripe-card-selection.component.scss']
})
export class StripeCardSelectionComponent implements OnInit {

  private _model: boolean = false;
  public financialCards: IOption[] = [];
  public card: string = '';
  public selectedFinancialCard: string;
  @Output() hasStripeCard: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() onSelectExistingCard: EventEmitter<any> = new EventEmitter<any>();


  private onModelChange: any = () => {};
  private onTouched: any = () => {};

  constructor(private stripeService: StripeService,
              private modalService: NgbModal,
              private errorService: ErrorsService) { }

  ngOnInit() {
    this.stripeService.getCards().subscribe((stripeCards: FinancialCard[]) => {
      //this.financialCards = stripeCards;
      //this.financialCards = [{expire_date: '08/21', id: 'pm_3423rf23fd23', number: '4424'}, {expire_date: '10/21', id: 'pm_34232f2d23', number: '5353'}];
      const stripeCard = {number: '2242', expire_date: '02/24'};
      this.financialCards = [{
        label: `**** **** **** ${stripeCard.number} ${stripeCard.expire_date}`,
        value: 'pm_21312dc1c1'
      }, {
        label: `**** **** **** ${stripeCard.number} ${stripeCard.expire_date}`,
        value: 'pm_23d3c3c2'
      }];
      this.selectedFinancialCard = this.financialCards[0].label;
      this.hasStripeCard.emit(!!this.financialCards);
    }, () => {
      this.hasStripeCard.emit(false);
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

  public setFinancialCard(selectedCard: IOption) {
    //@TODO call retrieve a card with its id endpoint
    this.stripeService.getCard(selectedCard.value).subscribe((financialCard: FinancialCard) => {
      //Set card as payment method
    });
    this.onSelectExistingCard.emit();
  }

}
