import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ItemService } from '@core/item/item.service';
import { ItemChangeEvent, ITEM_CHANGE_ACTION } from '../../core/item-change.interface';
import { Item } from '@core/item/item';
import { EventService } from '@core/event/event.service';
import { Router } from '@angular/router';
import { UPLOAD_PATHS } from '@private/features/upload/upload-routing-constants';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';
import { I18nService } from '@core/i18n/i18n.service';
import { ItemRequiredDataService } from '@private/core/services/item-required-data/item-required-data.service';
import { CatalogItemTrackingEventService } from '../../core/services/catalog-item-tracking-event.service';
import { PERMISSIONS } from '@core/user/user-constants';
import { TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ItemDetailRoutePipe } from '@shared/pipes';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { BUMPS_PATHS } from '@private/features/bumps/bumps-routing-constants';

@Component({
  selector: 'tsl-catalog-item',
  templateUrl: './catalog-item.component.html',
  styleUrls: ['./catalog-item.component.scss'],
})
export class CatalogItemComponent implements OnInit {
  @Input() item: Item;
  @Input() showPublishCTA = false;
  @Output() itemChange: EventEmitter<ItemChangeEvent> = new EventEmitter<ItemChangeEvent>();
  public readonly PERMISSIONS = PERMISSIONS;
  public link: string;
  public selectMode = false;
  public tooltipMessages = {
    markAsSold: $localize`:@@web_mark_as_sold_tooltip:Mark as sold`,
    markAsReserved: $localize`:@@web_mark_as_reserved_tooltip:Mark as reserved`,
    edit: $localize`:@@web_edit_tooltip:Edit`,
  };

  constructor(
    public itemService: ItemService,
    private toastService: ToastService,
    private eventService: EventService,
    private itemRequiredDataService: ItemRequiredDataService,
    private catalogItemTrackingEventService: CatalogItemTrackingEventService,
    private router: Router,
    private i18nService: I18nService,
    private itemDetailRoutePipe: ItemDetailRoutePipe
  ) {}

  ngOnInit() {
    this.link = this.itemDetailRoutePipe.transform(this.item.webSlug);
    this.itemService.selectedItems$.subscribe(() => {
      this.selectMode = this.itemService.selectedItems.length !== 0;
    });
  }

  public reserve(item: Item) {
    if (!item.reserved) {
      this.itemService.selectedAction = 'reserve';
      this.itemService.reserveItem(item.id, true).subscribe(() => {
        item.reserved = true;
      });
    } else {
      this.itemService.reserveItem(item.id, false).subscribe(() => {
        item.reserved = false;
        this.eventService.emit(EventService.ITEM_RESERVED, item);
      });
    }
  }

  public featureItem(item: Item): void {
    this.router.navigate([`${PRIVATE_PATHS.BUMPS}/${BUMPS_PATHS.CHECKOUT}`, { itemId: item.id }]);
  }

  public activateItem(item: Item): void {
    this.itemChange.emit({ item, action: ITEM_CHANGE_ACTION.ACTIVATE });
  }

  public reactivate(item: Item): void {
    this.reactivateItem(item);
  }

  public select(item: Item) {
    item.selected = !item.selected;
    this.itemService.selectedAction = this.itemService.selectedAction === 'feature' ? 'feature' : '';
    if (item.selected) {
      this.itemService.selectItem(item.id);
    } else {
      this.itemService.deselectItem(item.id);
    }
  }

  public setSold(item: Item) {
    this.itemChange.emit({
      item: item,
      action: ITEM_CHANGE_ACTION.SOLD,
    });
    this.eventService.emit(EventService.ITEM_SOLD, item);
  }

  private reactivateItem(item: Item): void {
    this.itemRequiredDataService.hasMissingRequiredDataByItemId(item.id).subscribe((missingRequiredData: boolean) => {
      this.catalogItemTrackingEventService.trackReactivateItemEvent(item);
      if (missingRequiredData) {
        this.router.navigate([`/catalog/edit/${this.item.id}/${UPLOAD_PATHS.REACTIVATE}`]);
      } else {
        this.itemService.reactivateItem(item.id).subscribe(
          () => {
            this.itemChange.emit({
              item,
              action: ITEM_CHANGE_ACTION.REACTIVATED,
            });
          },
          () => this.toastService.show({ text: this.i18nService.translate(TRANSLATION_KEY.DEFAULT_ERROR_MESSAGE), type: TOAST_TYPES.ERROR })
        );
      }
    });
  }
}
