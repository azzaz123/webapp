import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../core/payments/payment.service';
import { Pack } from '../core/payments/pack';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { PerksModel } from '../core/payments/payment.model';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { Router } from '@angular/router';
import { NguCarousel } from '@ngu/carousel';

@Component({
  selector: 'tsl-wallacoins',
  templateUrl: './wallacoins.component.html',
  styleUrls: ['./wallacoins.component.scss']
})
export class WallacoinsComponent implements OnInit {

  public packs: Pack[];
  public wallacoins: number = 0;
  public carouselOptions: NguCarousel;
  public currencyName: string;
  public factor: number;

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private router: Router){
  }

  ngOnInit() {
    this.carouselOptions = {
      grid: {xs: 3, sm: 3, md: 3, lg: 3, all: 0},
      slide: 1,
      speed: 400,
      interval: 0,
      point: {
        visible: false
      },
      loop: false,
      custom: 'banner'
    };
    this.paymentService.getCoinsCreditsPacks().subscribe((packs: Pack[]) => {
      this.packs = packs;
      this.currencyName = this.packs[0].name;
      this.factor = this.packs[0].factor;
      this.updatePerks();
    });
  }

  get withCoins(): boolean {
    return this.currencyName === 'wallacoins';
  }

  private updatePerks(cache?: boolean) {
    this.paymentService.getPerks(cache).subscribe((perks: PerksModel) => {
      this.wallacoins = perks[this.currencyName].quantity;
    });
  }

  public openBuyModal(pack: Pack, packIndex: number) {
    const modal: NgbModalRef = this.modalService.open(BuyWallacoinsModalComponent, {windowClass: 'buy-wallacoins'});
    modal.componentInstance.pack = pack;
    modal.componentInstance.packIndex = packIndex;
    modal.result.then(() => {
      this.updatePerks(false);
      this.openConfirmModal(pack);
    }, () => {
    });
  }

  private openConfirmModal(pack: Pack) {
    const modal: NgbModalRef = this.modalService.open(WallacoinsConfirmModalComponent, {windowClass: 'confirm-wallacoins'});
    modal.componentInstance.pack = pack;
    modal.result.then(() => {
      this.router.navigate(['catalog/list']);
    }, () => {
    });
  }

}
