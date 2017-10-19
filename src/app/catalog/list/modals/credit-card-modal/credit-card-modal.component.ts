import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FinancialCard } from 'shield';

@Component({
  selector: 'tsl-credit-card-modal',
  templateUrl: './credit-card-modal.component.html',
  styleUrls: ['./credit-card-modal.component.scss']
})
export class CreditCardModalComponent implements OnInit {

  public financialCard: FinancialCard;
  public cardType = 'old';
  public total: number;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
