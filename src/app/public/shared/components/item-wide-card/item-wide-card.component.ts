import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Car } from '@core/item/car';
import { Realestate } from '@core/item/realestate';

@Component({
  selector: 'tsl-item-wide-card',
  templateUrl: './item-wide-card.component.html',
  styleUrls: ['./item-wide-card.component.scss'],
})
export class ItemWideCardComponent implements OnInit {
  @Input() item: Car | Realestate;
  @Input() showFavourite = true;
  @Output() toggleFavourite: EventEmitter<void> = new EventEmitter<void>();
  @Output() itemClick: EventEmitter<void> = new EventEmitter<void>();

  ngOnInit(): void {}
}
