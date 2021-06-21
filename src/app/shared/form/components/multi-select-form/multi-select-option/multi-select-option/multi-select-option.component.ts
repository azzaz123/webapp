import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tsl-multi-select-option',
  templateUrl: './multi-select-option.component.html',
  styleUrls: ['./multi-select-option.component.scss'],
})
export class MultiSelectOptionComponent implements OnInit {
  @Input() option: string;
  @Input() isChecked: boolean;
  @Input() isDisabled: boolean;
  @Output() toggleOnChange: EventEmitter<{ option: string; isChecked: boolean }> = new EventEmitter<{
    option: string;
    isChecked: boolean;
  }>();

  public checked = false;

  constructor() {}

  ngOnInit(): void {}

  toggleCheckbox($event) {
    const isChecked = $event.target.checked;
    this.toggleOnChange.emit({ option: this.option, isChecked });
  }
}
