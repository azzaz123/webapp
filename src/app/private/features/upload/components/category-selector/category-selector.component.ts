import { Component, EventEmitter, Output } from '@angular/core';
import { CATEGORY_IDS } from '@core/category/category-ids';
import { NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss'],
})
export class CategorySelectorComponent {
  @Output() selected: EventEmitter<string> = new EventEmitter();
  public category: number;
  public CATEGORY_IDS = CATEGORY_IDS;

  constructor(config: NgbPopoverConfig) {
    config.placement = 'right';
    config.triggers = 'focus:blur';
    config.container = 'body';
  }

  setCategory(value: number) {
    this.category = value;
    this.selected.emit(value.toString());
  }
}
