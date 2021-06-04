import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { PaymentService } from '../../../../core/payments/payment.service';
import { Pack } from '../../../../core/payments/pack';
import { NgbCarousel, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BuyWallacoinsModalComponent } from '../components/buy-wallacoins-modal/buy-wallacoins-modal.component';
import { PerksModel } from '../../../../core/payments/payment.model';
import { WallacoinsConfirmModalComponent } from '../components/wallacoins-confirm-modal/wallacoins-confirm-modal.component';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../../core/event/event.service';
import { UserService } from '../../../../core/user/user.service';
import { WallacoinsTutorialComponent } from '../components/wallacoins-tutorial/wallacoins-tutorial.component';

@Component({
  selector: 'tsl-wallacoins',
  templateUrl: './wallacoins.component.html',
  styleUrls: ['./wallacoins.component.scss'],
})
export class WallacoinsComponent implements OnInit {
  public packs: Pack[];
  public wallacoins: number = 0;
  public currencyName: string;
  public factor: number;
  public loading = true;
  private localStorageName = '-wallacoins-tutorial';
  public itemsPerSlide = [0, 1, 2]; // = 3. Has to be an array to be able to used in the ngFor
  @ViewChild(NgbCarousel) ngbCarousel: NgbCarousel;

  constructor(
    private paymentService: PaymentService,
    private modalService: NgbModal,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.openTutorialModal();
    this.paymentService.getCreditsPacks().subscribe((packs: Pack[]) => {
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
      }
    });
  }

  ngAfterContentChecked() {
    this.cd.detectChanges();
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
    const modal: NgbModalRef = this.modalService.open(BuyWallacoinsModalComponent, { windowClass: 'modal-standard' });
    let code = '-1';
    modal.componentInstance.pack = pack;
    modal.componentInstance.packIndex = packIndex;
    modal.result.then(
      (response) => {
        if (response === 'success' || response.status === '201' || response.status === 201) {
          code = '200';
          this.updateRemainingCredit(pack);
        }
        this.openConfirmModal(pack, code);
      },
      () => {}
    );
  }

  private openConfirmModal(pack: Pack, code = '200') {
    const modal: NgbModalRef = this.modalService.open(WallacoinsConfirmModalComponent, { windowClass: 'confirm-wallacoins' });
    modal.componentInstance.pack = pack;
    modal.componentInstance.code = code;
    modal.componentInstance.total = this.wallacoins;
    modal.result.then(
      () => {
        this.router.navigate(['catalog/list']);
      },
      () => {}
    );
  }

  private openTutorialModal() {
    if (!this.isAlreadyDisplayed()) {
      this.setDisplayed();
      this.modalService.open(WallacoinsTutorialComponent, {
        windowClass: 'tutorial-wallacoins',
      });
    }
  }

  private setDisplayed(): void {
    if (this.userService.user) {
      localStorage.setItem(this.userService.user.id + this.localStorageName, 'true');
    }
  }

  private isAlreadyDisplayed(): boolean {
    const user = this.userService.user;

    return !!localStorage.getItem(user.id + this.localStorageName);
  }
}
