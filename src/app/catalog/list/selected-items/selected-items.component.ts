import { Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ItemService } from '../../../core/item/item.service';
import { Item } from 'shield';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-selected-items',
  templateUrl: './selected-items.component.html',
  styleUrls: ['./selected-items.component.scss'],
  animations: [
    trigger('enterFromBottom', [
      transition(':enter', [
        style({transform: 'translateY(100%)'}),
        animate('300ms', style({transform: 'translateY(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateY(0%)'}),
        animate('300ms', style({transform: 'translateY(100%)'}))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({opacity: 0}),
        animate('300ms', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('300ms', style({opacity: 0}))
      ])
    ])
  ]
})
export class SelectedItemsComponent implements OnChanges {

  @HostBinding('@enterFromBottom') public animation: void;
  @Input() items: Item[];
  @Input() selectedItemsLength: number;
  public selectedItems: Item[];

  constructor(public itemService: ItemService) {
  }

  ngOnChanges() {
    this.selectedItems = this.itemService.selectedItems.map((id: string) => {
      return <Item>_.find(this.items, {id: id});
    });
  }

}
