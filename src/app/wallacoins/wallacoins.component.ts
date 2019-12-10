import { Component, OnInit } from '@angular/core';
import { PaymentService } from '../core/payments/payment.service';
import { Pack } from '../core/payments/pack';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from './buy-wallacoins-modal/buy-wallacoins-modal.component';
import { PerksModel } from '../core/payments/payment.model';
import { WallacoinsConfirmModalComponent } from './wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../core/event/event.service';
import { NguCarousel } from '@ngu/carousel';
import { TrackingService } from '../core/tracking/tracking.service';
import { UserService } from '../core/user/user.service';
import { WallacoinsTutorialComponent } from './wallacoins-tutorial/wallacoins-tutorial.component';
import { Observable } from 'rxjs';
import { User } from '../core/user/user';
import { StripeService } from '../core/stripe/stripe.service';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_TYPE, WEB_PAYMENT_EXPERIMENT_PAGEVIEW_EVENT, WEB_PAYMENT_EXPERIMENT_NAME, WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT } from '../core/tracking/split-test.service';

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
  public loading = true;
  private localStorageName = '-wallacoins-tutorial';
  public paymentMethod: WEB_PAYMENT_EXPERIMENT_TYPE;

  constructor(private paymentService: PaymentService,
              private modalService: NgbModal,
              private eventService: EventService,
              private route: ActivatedRoute,
              private trackingService: TrackingService,
              private router: Router,
              private userService: UserService,
              private splitTestService: SplitTestService){

    this.userService.isProfessional().subscribe((value: boolean) => {
      if (value) {
        this.router.navigate(['/pro/catalog/list']);
      }
    });
  }

  ngOnInit() {
    this.splitTestService.getVariable<WEB_PAYMENT_EXPERIMENT_TYPE>(WEB_PAYMENT_EXPERIMENT_NAME, WEB_PAYMENT_EXPERIMENT_TYPE.sabadell)
    .subscribe((paymentMethod: number) => {
      this.splitTestService.track(WEB_PAYMENT_EXPERIMENT_PAGEVIEW_EVENT);
      this.paymentMethod = +paymentMethod;
    });
    this.openTutorialModal();
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
      this.updatePerks(false);
    });
    this.route.params.subscribe((params: any) => {
      if (params && params.code) {
        const packJson = JSON.parse(localStorage.getItem('pack'));
        const pack = new Pack(packJson._id, +packJson._quantity, +packJson._price, packJson._currency, packJson._name);
        localStorage.removeItem('transactionType');
        localStorage.removeItem('pack');
        this.openConfirmModal(pack, params.code);
        if (params.code === '-1') {
          this.trackingService.track(TrackingService.BUY_MORE_CREDITS_ERROR);
        }
      }
    });
  }

  get withCoins(): boolean {
    return this.currencyName === 'wallacoins';
  }

  private updatePerks(cache?: boolean) {
    this.paymentService.getPerks(cache).subscribe((perks: PerksModel) => {
      this.wallacoins = perks[this.currencyName].quantity;
      this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED, this.wallacoins);
      this.loading = false;
    });
  }

  private updateRemainingCredit(pack: Pack): void {
    this.wallacoins = this.wallacoins + pack.quantity;
    this.eventService.emit(EventService.TOTAL_CREDITS_UPDATED, this.wallacoins);
  }

  public openBuyModal(pack: Pack, packIndex: number) {
    const modal: NgbModalRef = this.modalService.open(BuyWallacoinsModalComponent, {windowClass: 'modal-standard'});
    let code = '-1';
    modal.componentInstance.pack = pack;
    modal.componentInstance.packIndex = packIndex;
    modal.componentInstance.paymentMethod = this.paymentMethod;
    modal.result.then((response) => {
      console.warn(response.status);
      if (response === 'success' || response.status === '201' || response.status === 201) {
        code = '200';
        this.updateRemainingCredit(pack);
      }
      this.openConfirmModal(pack, code);
    }, () => {
    });
  }

  private openConfirmModal(pack: Pack, code = '200') {
    const modal: NgbModalRef = this.modalService.open(WallacoinsConfirmModalComponent, {windowClass: 'confirm-wallacoins'});
    modal.componentInstance.pack = pack;
    modal.componentInstance.code = code;
    modal.componentInstance.total = this.wallacoins;
    if (code === '200') {
      this.splitTestService.track(WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT);
    }
    modal.result.then(() => {
      this.router.navigate(['catalog/list']);
    }, () => {
    });
  }

  private openTutorialModal() {
    this.isAlreadyDisplayed().subscribe((isDisplayed: boolean) => {
      if (!isDisplayed) {
        this.setDisplayed();
        this.modalService.open(WallacoinsTutorialComponent, {windowClass: 'tutorial-wallacoins'});
      }
    });
  }

  private setDisplayed(): void {
    if (this.userService.user) {
      localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
    }
  }

  private isAlreadyDisplayed(): Observable<boolean> {
    return this.userService.me()
      .map((user: User) => !!localStorage.getItem(user.id + this.localStorageName));
  }

}
