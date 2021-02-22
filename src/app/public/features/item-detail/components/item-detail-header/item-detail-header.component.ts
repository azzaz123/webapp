import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { User } from '@core/user/user';
import { PublicProfileService } from '@public/features/public-profile/core/services/public-profile.service';
import { UserStats } from '@core/user/user-stats.interface';
import { USER_INFO_SIZE } from '@public/shared/components/user-basic-info/constants/user-basic-info-constants';
import { Item } from '@core/item/item';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DeleteInfoConfirmationModalComponent } from '@shared/profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';
import { ErrorsService } from '@core/errors/errors.service';
import { ItemDetailService } from '../../core/services/item-detail.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { SoldModalComponent } from '@shared/modals/sold-modal/sold-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'tsl-item-detail-header',
  templateUrl: './item-detail-header.component.html',
  styleUrls: ['./item-detail-header.component.scss'],
})
export class ItemDetailHeaderComponent implements OnInit {
  @Input() user: User;
  @Input() item: Item;
  @Input() isOwner = false;
  @Output() updatedItem: EventEmitter<Item> = new EventEmitter<Item>();

  public readonly USER_INFO_SIZE = USER_INFO_SIZE;
  public userStats: UserStats;
  public showOptions = false;

  constructor(
    private publicProfileService: PublicProfileService,
    private modalService: NgbModal,
    private itemDetailService: ItemDetailService,
    private errorsService: ErrorsService,
    private checkSessionService: CheckSessionService,
    private itemCardService: ItemCardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserStats();
    this.checkShowMineOptions();
  }

  public toggleItemFavorite(): void {
    this.checkSessionService.hasSession() ? this.itemCardService.toggleFavourite(this.item) : this.checkSessionService.checkSessionAction();
  }

  public reserveItem(): void {
    if (!this.item.reserved) {
      this.itemDetailService.reserveItem(this.item.id, true).subscribe((item: Item) => {
        this.item.reserved = true;
        this.emitUpdatedItem(item);
      });
    } else {
      this.itemDetailService.reserveItem(this.item.id, false).subscribe(() => {
        this.item.reserved = false;
      });
    }
  }

  public soldItem(): void {
    const modalRef: NgbModalRef = this.modalService.open(SoldModalComponent, {
      windowClass: 'sold',
    });
    modalRef.componentInstance.item = this.item;
    modalRef.result.then(() => {
      this.item.sold = true;
    });
  }

  public deleteItem(): void {
    this.modalService.open(DeleteInfoConfirmationModalComponent).result.then((result: boolean) => {
      if (result) {
        this.itemDetailService.deleteItem(this.item.id).subscribe(
          () => {
            this.errorsService.i18nSuccess('deleteItemSuccess');
            this.router.navigate(['catalog/list']);
          },
          () => {
            this.errorsService.i18nError('deleteItemError');
          }
        );
      }
    });
  }

  private emitUpdatedItem(item: Item): void {
    this.updatedItem.emit(item);
  }

  private getUserStats(): void {
    this.publicProfileService.getStats(this.user?.id).subscribe((userStats: UserStats) => {
      this.userStats = userStats;
    });
  }

  private checkShowMineOptions(): void {
    this.showOptions = !this.item.sold && !this.item.flags.onhold && !this.item.flags.expired && !this.item.flags.notAvailable;
  }
}
