import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { SelectOption } from './select.interface';
import { find } from 'lodash-es';

@Component({
  selector: 'tsl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnChanges {
  @Input() public items: SelectOption[];
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('valueChanges') public value$: EventEmitter<SelectOption> = new EventEmitter<SelectOption>();
  @Input() value: any;
  public selected: SelectOption;

  constructor() {}

  ngOnChanges(changes?: any) {
    this.selected = find(this.items, { value: this.value }) || this.items[0];
  }

  public selectItem(item: SelectOption) {
    this.selected = item;
    this.value$.emit(item.value);
  }
}
