import { Component, EventEmitter, HostBinding, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { ItemService } from '../../../core/item/item.service';
import { find } from 'lodash-es';
import { SelectedItemsAction } from '../../../core/item/item-response.interface';
import { OrderEvent } from './selected-product.interface';
import { Item } from '../../../core/item/item';

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
    ])
  ]
})
export class SelectedItemsComponent implements OnInit, OnDestroy {

  @HostBinding('@enterFromBottom') public animation: void;
  @Input() items: Item[];
  @Input() isStripe = false;
  @Output() onAction: EventEmitter<OrderEvent> = new EventEmitter();
  public selectedItems: Item[];
  private active = true;

  constructor(public itemService: ItemService) {
  }

  ngOnInit() {
    this.itemService.selectedItems$.takeWhile(() => {
      return this.active;
    }).subscribe((action: SelectedItemsAction) => {
      this.selectedItems = this.itemService.selectedItems.map((id: string) => {
        return <Item>find(this.items, {id: id});
      });
    });
  }

  ngOnDestroy() {
    this.active = false;
  }

}
