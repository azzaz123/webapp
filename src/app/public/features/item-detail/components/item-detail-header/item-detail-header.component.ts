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
import { finalize } from 'rxjs/operators';
import { ItemDetailTrackEventsService } from '../../core/services/item-detail-track-events/item-detail-track-events.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { I18nService } from '@core/i18n/i18n.service';
import { COLORS } from '@core/colors/colors-constants';
import { PERMISSIONS } from '@core/user/user-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BUMPS_PATHS } from '@private/features/bumps/bumps-routing-constants';

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
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly BUMP_PATH = `/${PRIVATE_PATHS.BUMPS}/${BUMPS_PATHS.CHECKOUT}`;

  public showOptions = false;
  public loading = true;
  public tooltipMessages = {
    markAsSold: $localize`:@@web_mark_as_sold_tooltip:Mark as sold`,
    markAsReserved: $localize`:@@web_mark_as_reserved_tooltip:Mark as reserved`,
    edit: $localize`:@@web_edit_tooltip:Edit`,
  };

  constructor(
    private modalService: NgbModal,
    private itemDetailService: ItemDetailService,
    private itemDetailTrackEventsService: ItemDetailTrackEventsService,
    private errorsService: ErrorsService,
    private checkSessionService: CheckSessionService,
    private router: Router,
    private i18nService: I18nService
  ) {}

  ngOnInit(): void {
    if (this.isOwner && this.item?.bumpFlags?.bumped) {
      this.initializeItemBumpExpiringDate();
    } else {
      this.loading = false;
    }
    this.checkShowOptions();
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
    const modalRef: NgbModalRef = this.modalService.open(ConfirmationModalComponent);

    modalRef.componentInstance.properties = {
      title: this.i18nService.translate(TRANSLATION_KEY.DELETE_ITEMS_TITLE),
      description: this.i18nService.translate(TRANSLATION_KEY.DELETE_ITEMS_DESCRIPTION),
      confirmMessage: this.i18nService.translate(TRANSLATION_KEY.DELETE_BUTTON),
      confirmColor: COLORS.NEGATIVE_MAIN,
    };

    modalRef.result.then(() => {
      this.itemDetailService.deleteItem(this.item.id).subscribe(
        () => {
          this.router.navigate(['catalog/list']);
        },
        () => {
          this.errorsService.i18nError(TRANSLATION_KEY.DELETE_ITEM_ERROR);
        }
      );
    });
  }

  public trackClickChatButton(item: Item, user: User): void {
    this.itemDetailTrackEventsService.trackClickChatButton(item, user);
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
