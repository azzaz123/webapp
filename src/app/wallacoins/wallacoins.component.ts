import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../core/payments/payment.service';
import { Pack } from '../core/payments/pack';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { PerksModel } from '../core/payments/payment.model';

@Component({
  selector: 'tsl-wallacoins',
  templateUrl: './wallacoins.component.html',
  styleUrls: ['./wallacoins.component.scss']
})
export class WallacoinsComponent implements OnInit {

  public packs: Pack[][];
  public wallacoins: number = 0;

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal) { }

  ngOnInit() {
    this.paymentService.getCreditsPacks().subscribe((packs: Pack[][]) => {
      this.packs = packs;
    });
    this.updatePerks();
  }

  private updatePerks(cache?: boolean) {
    this.paymentService.getPerks(cache).subscribe((perks: PerksModel) => {
      this.wallacoins = perks.wallacoins.quantity;
    });
  }

  public openBuyModal(pack: Pack) {
    const modal: NgbModalRef = this.modalService.open(BuyWallacoinsModalComponent, {windowClass: 'buy-wallacoins'});
    modal.componentInstance.pack = pack;
    modal.result.then(() => {
      this.updatePerks(false);
    }, () => {});
  }

}
