import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { SubscriptionResponse } from '@core/subscriptions/subscriptions.interface';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ChangeCardModalComponent } from '@shared/modals/change-card-modal/change-card-modal.component';
import { NewCardModalComponent } from '@shared/modals/new-card-modal/new-card-modal.component';
import { FinancialCard } from '@shared/profile/credit-card-info/financial-card';

export const test = 'AAAA';

@Component({
  selector: 'tsl-subscription-card-selector',
  templateUrl: './subscription-card-selector.component.html',
  styleUrls: ['./subscription-card-selector.component.scss'],
})
export class SubscriptionCardSelectorComponent implements OnInit, OnChanges {
  @Input() stripeCards: FinancialCard[];
  @Input() selectedCard: FinancialCard;
  @Output() changeSelectedCard: EventEmitter<FinancialCard> = new EventEmitter();
  public showChangeLink: boolean;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.showChangeLink =
      this.stripeCards?.length > 1 || (this.stripeCards?.length > 0 && !this.stripeCards.find((card) => card.id === this.selectedCard.id));
  }

  public addNewCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(NewCardModalComponent, {
      windowClass: 'review',
    });
    modalRef.result
      .then(
        (financialCard: FinancialCard) => {
          this.changeSelectedCard.emit(financialCard);
        },
        () => {}
      )
      .catch(() => {});
  }

  public addNewSubscriptionCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(ChangeCardModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.isNewSubscription = true;
    modalRef.result
      .then(
        (card) => {
          this.changeSelectedCard.emit(card);
        },
        () => {}
      )
      .catch(() => {});
  }
}
