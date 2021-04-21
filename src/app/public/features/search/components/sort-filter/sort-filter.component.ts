import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'tsl-sort-filter',
  templateUrl: 'sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent {
  @Output() toggleBubble: EventEmitter<boolean> = new EventEmitter<boolean>();

  openChange(event: boolean): void {
    console.log('sort filter openChange', event);
    this.toggleBubble.emit(event);
  }
}
