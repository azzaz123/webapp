import { Component, Inject, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/item/item';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ItemStatsService } from './item-stats-graph/item-stats.service';
import { ItemStatisticFullResponse } from './item-stats-graph/item-stats-response.interface';

@Component({
  selector: 'tsl-item-stats-row',
  templateUrl: './item-stats-row.component.html',
  styleUrls: ['./item-stats-row.component.scss']
})
export class ItemStatsRowComponent implements OnInit {

  @Input() item: Item;
  public open = false;
  public link: string;
  public momentConfig: any;
  public statsData: ItemStatisticFullResponse;

  constructor(@Inject('SUBDOMAIN') private subdomain: string,
              private i18n: I18nService,
              private itemStatsService: ItemStatsService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
  }

  ngOnInit() {
    this.link = this.item.getUrl(this.subdomain);
    this.itemStatsService.getStatistics().subscribe((response: ItemStatisticFullResponse) => {
      this.statsData = response;
    });
  }

  changeExpandedState() {
    this.open = !this.open;
  }

}
