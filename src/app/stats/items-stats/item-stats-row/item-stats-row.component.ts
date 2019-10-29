import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { Item } from '../../../core/item/item';
import { ItemStatsService } from './item-stats-graph/item-stats.service';
import { ItemStatisticFullResponse } from './item-stats-graph/item-stats-response.interface';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { ItemService } from '../../../core/item/item.service';
import { ItemCounters } from '../../../core/item/item-response.interface';
import { every, isEmpty } from 'lodash-es';

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
  public noData: boolean;

  constructor(@Inject('SUBDOMAIN') private subdomain: string,
              private itemStatsService: ItemStatsService,
              private itemService: ItemService) {
    this.momentConfig = 'DD MMM YYYY';
  }

  ngOnInit() {
    this.link = this.item.getUrl(this.subdomain);
    this.itemStatsService.getStatistics(this.item.id).subscribe((response: ItemStatisticFullResponse) => {
      this.statsData = response;
      this.noData = every(response.entries, (entry) => !entry.values || isEmpty(entry.values));
    });
    if (this.item.views === 0 || this.item.favorites === 0) {
      this.itemService.getCounters(this.item.id).subscribe((counters: ItemCounters) => {
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

}
