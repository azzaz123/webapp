import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'tsl-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent {

  @Output() onSelect: EventEmitter<string> = new EventEmitter();
  private category: number;

  constructor() {
  }

  setCategory(value: number) {
    this.category = value;
    this.onSelect.emit(value.toString());
  }

}
