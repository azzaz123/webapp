import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Item } from '@core/item/item';
import { ItemCounters } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import {
  ItemStatisticEntriesResponse,
  ItemStatisticFullResponse,
} from '@features/stats/core/item-stats-response.interface';
import { ItemStatsService } from '@features/stats/core/services/item-stats.service';
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
  public momentConfig: any;
  public statsData: ItemStatisticFullResponse;
  public noData: boolean;

  constructor(
    @Inject('SUBDOMAIN') private subdomain: string,
    private itemStatsService: ItemStatsService,
    private itemService: ItemService
  ) {
    this.momentConfig = 'dd MMM yyyy';
  }

  ngOnInit() {
    this.link = this.item.getUrl(this.subdomain);
    this.itemStatsService
      .getStatistics(this.item.id)
      .subscribe((response: ItemStatisticFullResponse) => {
        this.statsData = { entries: [] };
        this.statsData.entries = this.removeCurrentDay(response);
        this.noData = every(
          response.entries,
          (entry) => !entry.values || isEmpty(entry.values)
        );
      });
    if (this.item.views === 0 || this.item.favorites === 0) {
      this.itemService
        .getCounters(this.item.id)
        .subscribe((counters: ItemCounters) => {
          this.item.views = counters.views;
          this.item.favorites = counters.favorites;
          this.item.conversations = counters.conversations;
        });
    }
  }

  changeExpandedState() {
    this.open = !this.open;
    if (this.open) {
      this.onOpen.emit(true);
    }
  }

  private removeCurrentDay(
    stats: ItemStatisticFullResponse
  ): ItemStatisticEntriesResponse[] {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    return stats.entries.filter(
      (stat) => stat.date !== today.getTime().toString()
    );
  }
}
