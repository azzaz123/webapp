import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '@core/user/user';
import { UserStats } from '@core/user/user-stats.interface';
import { USER_INFO_SIZE } from '@public/shared/components/user-basic-info/constants/user-basic-info-constants';
import { Item } from '@core/item/item';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsService } from '@core/errors/errors.service';
import { ItemDetailService } from '../../core/services/item-detail/item-detail.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { SoldModalComponent } from '@shared/modals/sold-modal/sold-modal.component';
import { Router } from '@angular/router';
import { ConfirmationModalComponent } from '@shared/confirmation-modal/confirmation-modal.component';
import {
  AnalyticsEvent,
  ANALYTICS_EVENT_NAMES,
  ANALYTIC_EVENT_TYPES,
  ClickChatButton,
  SCREEN_IDS,
} from '@core/analytics/analytics-constants';
import { finalize } from 'rxjs/operators';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Component({
  selector: 'tsl-item-detail-header',
  templateUrl: './item-detail-header.component.html',
  styleUrls: ['./item-detail-header.component.scss'],
})
export class ItemDetailHeaderComponent implements OnInit {
  @Input() user: User;
  @Input() item: Item;
  @Input() isOwner = false;
  @Input() userStats: UserStats;
  @Output() reservedItemChange: EventEmitter<void> = new EventEmitter();
  @Output() favouritedItemChange: EventEmitter<void> = new EventEmitter();
  @Output() soldItemChange: EventEmitter<void> = new EventEmitter();

  public readonly USER_INFO_SIZE = USER_INFO_SIZE;
  public showOptions = false;
  public loading = true;

  constructor(
    private modalService: NgbModal,
    private itemDetailService: ItemDetailService,
    private analyticsService: AnalyticsService,
    private errorsService: ErrorsService,
    private checkSessionService: CheckSessionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.isOwner && this.item?.bumpFlags?.bumped) {
      this.initializeItemBumpExpiringDate();
    } else {
      this.loading = false;
    }
    this.checkShowOptions();
  }

  public trackChatButton(): void {
    const event: AnalyticsEvent<ClickChatButton> = {
      name: ANALYTICS_EVENT_NAMES.ClickChatButton,
      eventType: ANALYTIC_EVENT_TYPES.Navigation,
      attributes: {
        itemId: this.item.id,
        sellerUserId: this.user.id,
        screenId: SCREEN_IDS.ItemDetail,
        isPro: this.user.featured,
        isBumped: !!this.item.purchases,
      },
    };
    this.analyticsService.trackEvent(event);
  }

  public toggleFavouriteItem(): void {
    this.checkSessionService.hasSession() ? this.favouritedItemChange.emit() : this.checkSessionService.checkSessionAction();
  }

  public toggleReserveItem(): void {
    this.reservedItemChange.emit();
  }

  public sellItem(): void {
    const modalRef: NgbModalRef = this.modalService.open(SoldModalComponent, {
      windowClass: 'sold',
    });
    modalRef.componentInstance.item = this.item;
    modalRef.result.then(() => {
      this.soldItemChange.emit();
      this.checkShowOptions();
    });
  }

  public deleteItem(): void {
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent, {
      windowClass: 'modal-prompt',
    });

    modalRef.componentInstance.type = 1;

    modalRef.result.then(() => {
      this.itemDetailService.deleteItem(this.item.id).subscribe(
        () => {
          this.router.navigate(['catalog/list']);
        },
        () => {
          this.errorsService.i18nError('deleteItemError');
        }
      );
    });
  }

  private initializeItemBumpExpiringDate(): void {
    this.itemDetailService
      .getItemActivePurchases(this.item.id)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe((purchases) => {
        if (purchases?.length) {
          this.item.bumpExpiringDate = purchases[0].expiration_date;
        }
      });
  }

  private checkShowOptions(): void {
    this.showOptions = !this.item.sold && !this.item.flags.onhold && !this.item.flags.expired && !this.item.flags.notAvailable;
  }
}
