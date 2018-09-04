import { Component, Inject, Input, OnInit } from '@angular/core';
import { Item } from '../../../core/item/item';
import { I18nService } from '../../../core/i18n/i18n.service';

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

  constructor(@Inject('SUBDOMAIN') private subdomain: string, private i18n: I18nService) {
    this.momentConfig = i18n.getTranslations('daysMomentConfig');
  }

  ngOnInit() {
    this.link = this.item.getUrl(this.subdomain);
  }

  changeExpandedState() {
    this.open = !this.open;
  }

}
