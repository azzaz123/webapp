import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SELECT_FORM_OPTIONS_CONFIG } from './sort-filter.config';

@Component({
  selector: 'tsl-sort-filter',
  templateUrl: 'sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent implements OnInit {
  public selectFormOptionsConfig: SelectFormOption<string>[] = SELECT_FORM_OPTIONS_CONFIG;
  public formControl: FormControl;

  public selected: SelectFormOption<string>;

  @ViewChild(NgbDropdown, { static: false }) public dropdown: NgbDropdown;

  @Output() toggleBubble: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() changeValue: EventEmitter<string> = new EventEmitter<string>();

  private static getSelectedValue(actualValue: string): SelectFormOption<string> {
    return SELECT_FORM_OPTIONS_CONFIG.find(({ value }: SelectFormOption<string>) => value === actualValue);
  }

  public ngOnInit(): void {
    this.formControl = new FormControl(this.selectFormOptionsConfig[0].value);
    this.selected = SortFilterComponent.getSelectedValue(this.formControl.value);
  }

  public openChange(event: boolean): void {
    this.toggleBubble.emit(event);
  }

  public onChangeValue(newValue: string): void {
    this.changeValue.emit(newValue);
    this.dropdown.close();
    this.selected = SortFilterComponent.getSelectedValue(this.formControl.value);
  }

  public cancel(): void {
    this.dropdown.close();
  }
}
