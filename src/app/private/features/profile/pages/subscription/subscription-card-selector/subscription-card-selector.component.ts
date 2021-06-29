import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from '@shared/payments-card-info/financial-card';
import { ChangeCardModalComponent } from '@shared/modals/change-card-modal/change-card-modal.component';
import { NewCardModalComponent } from '@shared/modals/new-card-modal/new-card-modal.component';

@Component({
  selector: 'tsl-subscription-card-selector',
  templateUrl: './subscription-card-selector.component.html',
  styleUrls: ['./subscription-card-selector.component.scss'],
})
export class SubscriptionCardSelectorComponent implements OnChanges {
  @Input() stripeCards: FinancialCard[];
  @Input() selectedCard: FinancialCard;
  @Input() error: boolean;
  @Output() changeSelectedCard: EventEmitter<FinancialCard> = new EventEmitter();
  @Output() clickNewCard: EventEmitter<void> = new EventEmitter();
  public showChangeLink: boolean;

  constructor(private modalService: NgbModal) {}

  ngOnChanges() {
    this.setShowChangeLink();
  }

  private setShowChangeLink(): void {
    this.showChangeLink =
      this.stripeCards?.length > 1 ||
      (this.stripeCards?.length === 1 && !this.stripeCards.find((card) => card.id === this.selectedCard.id));
  }

  public onAddCard(): void {
    this.clickNewCard.emit();
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

  public onChangeCard(): void {
    let modalRef: NgbModalRef = this.modalService.open(ChangeCardModalComponent, { windowClass: 'review' });
    modalRef.componentInstance.isNewSubscription = true;
    modalRef.result
      .then(
        (financialCard: FinancialCard) => {
          this.changeSelectedCard.emit(financialCard);
        },
        () => {}
      )
      .catch(() => {});
  }
}
