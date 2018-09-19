import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../../core/item/item';
import { I18nService } from '../../../core/i18n/i18n.service';
import { ItemStatsService } from './item-stats-graph/item-stats.service';
import { ItemStatisticFullResponse } from './item-stats-graph/item-stats-response.interface';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'tsl-item-stats-row',
  templateUrl: './item-stats-row.component.html',
  styleUrls: ['./item-stats-row.component.scss'],
  animations: [
    trigger('collapse', [
      state(
        'false',
        style({
          opacity: '1',
          overflow: 'visible',
          height: '*',
        })
      ),
      state(
        'true',
        style({
          opacity: '0',
          overflow: 'hidden',
          height: '0px',
        })
      ),
      transition(
        'false => true',
        animate(
          '.3s ease-in',
          keyframes([
            style({ overflow: 'visible', height: '*', opacity: '1', offset: 0 }),
            style({ overflow: 'hidden', height: '*', opacity: '1', offset: 0.01 }),
            style({ overflow: 'hidden', height: '0px', opacity: '0', offset: 1 }),
          ])
        )
      ),
      transition(
        'true => false',
        animate(
          '.3s ease-out',
          keyframes([
            style({ overflow: 'hidden', height: '0px', opacity: '0', offset: 0 }),
            style({ overflow: 'hidden', height: '*', opacity: '1', offset: 0.99 }),
            style({ overflow: 'visible', height: '*', opacity: '1', offset: 1 }),
          ])
        )
      ),
    ]),
  ],
})
export class ItemStatsRowComponent implements OnInit {

  @Input() item: Item;
  @Output() onOpen: EventEmitter<boolean> = new EventEmitter();
  @Input() open = false;
  @Input() price: string;
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
    if (this.open) {
      this.onOpen.emit(true);
    }
  }

}
