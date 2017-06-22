import { Component, OnInit, Input, EventEmitter, OnChanges } from '@angular/core';
import { Output } from '@angular/core/src/metadata/directives';
import { SelectOption } from './select.interface';
import * as _ from 'lodash';

@Component({
  selector: 'tsl-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnChanges {

  @Input() public items: SelectOption[];
  @Output('valueChanges') public value$: EventEmitter<SelectOption> = new EventEmitter<SelectOption>();
  @Input() value: any;
  public selected: SelectOption;

  constructor() {
  }

  ngOnChanges(changes?: any) {
    this.selected = _.find(this.items, {value: this.value}) || this.items[0];
  }

  public selectItem(item: SelectOption) {
    this.selected = item;
    this.value$.emit(item.value);
  }

}
