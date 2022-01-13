import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Item } from '@core/item/item';
import { PERMISSIONS } from '@core/user/user-constants';
import { BUMPS_PATHS } from '@private/features/bumps/bumps-routing-constants';
import { ItemStatisticEntriesResponse, ItemStatisticFullResponse } from '@private/features/stats/core/item-stats-response.interface';
import { ItemStatsService } from '@private/features/stats/core/services/item-stats.service';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { every, isEmpty } from 'lodash-es';
import { ITEM_STATS_ROW_ANIMATION } from './item-stats-row.animation';

@Component({
  selector: 'tsl-item-stats-row',
  templateUrl: './item-stats-row.component.html',
  styleUrls: ['./item-stats-row.component.scss'],
  animations: [ITEM_STATS_ROW_ANIMATION],
})
export class ItemStatsRowComponent implements OnInit {
  @Input() item: Item;
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter();
  @Input() open = false;
  @Input() price: string;
  public link: string;
  public publishedItemDateFormat = 'dd MMM yyyy';
  public statsData: ItemStatisticFullResponse;
  public noData: boolean;
  public tooltipMessages = {
    views: $localize`:@@web_stats_item_views_tooltip:Views`,
    chats: $localize`:@@web_stats_item_chats_tooltip:Chats`,
    favourites: $localize`:@@web_stats_item_favourites_tooltip:Favourites`,
  };
  public readonly PERMISSIONS = PERMISSIONS;
  public readonly BUMP_PATH = `/${PRIVATE_PATHS.BUMPS}/${BUMPS_PATHS.CHECKOUT}`;

  constructor(private itemStatsService: ItemStatsService) {}

  ngOnInit() {
    this.itemStatsService.getStatistics(this.item.id).subscribe((response: ItemStatisticFullResponse) => {
      this.statsData = { entries: [] };
      this.statsData.entries = this.removeCurrentDay(response);
      this.noData = every(response.entries, (entry) => !entry.values || isEmpty(entry.values));
    });
  }

  changeExpandedState() {
    this.open = !this.open;
    if (this.open) {
      this.onOpen.emit(true);
    }
  }

  private removeCurrentDay(stats: ItemStatisticFullResponse): ItemStatisticEntriesResponse[] {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return stats.entries.filter((stat) => stat.date !== today.getTime().toString());
  }
}
