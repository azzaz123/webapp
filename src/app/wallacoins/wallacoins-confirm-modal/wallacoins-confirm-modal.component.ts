import { Component, OnInit } from '@angular/core';
import { Pack } from '../../core/payments/pack';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-wallacoins-confirm-modal',
  templateUrl: './wallacoins-confirm-modal.component.html',
  styleUrls: ['./wallacoins-confirm-modal.component.scss']
})
export class WallacoinsConfirmModalComponent implements OnInit {

  public pack: Pack;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

}
