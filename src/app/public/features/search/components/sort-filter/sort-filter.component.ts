import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SELECT_FORM_OPTIONS_CONFIG, SORT_BY } from './sort-filter.config';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';

@Component({
  selector: 'tsl-sort-filter',
  templateUrl: 'sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent {
  private static KEY_PARAMETER: FILTER_QUERY_PARAM_KEY = FILTER_QUERY_PARAM_KEY.orderBy;
  public selectFormOptionsConfig: SelectFormOption<SORT_BY>[] = SELECT_FORM_OPTIONS_CONFIG;
  public formControl: FormControl = new FormControl(this.selectFormOptionsConfig[0].value);
  public selected: SelectFormOption<SORT_BY> = SortFilterComponent.getSelectedValue(this.formControl.value);
  @ViewChild(NgbDropdown, { static: false }) public dropdown: NgbDropdown;
  @Output() toggleBubble: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() set value(value: SORT_BY) {
    const selected = SortFilterComponent.getSelectedValue(value);
    if (selected) {
      this.selected = selected;
      this.formControl.setValue(value);
    }
  }

  private static getSelectedValue(actualValue: string): SelectFormOption<SORT_BY> {
    return SELECT_FORM_OPTIONS_CONFIG.find(({ value }: SelectFormOption<SORT_BY>) => value === actualValue);
  }

  constructor(private searchNavigatorService: SearchNavigatorService) {}

  public openChange(event: boolean): void {
    this.toggleBubble.emit(event);
  }

  public onChangeValue(newValue: string): void {
    this.selected = SortFilterComponent.getSelectedValue(newValue);
    if (newValue === SELECT_FORM_OPTIONS_CONFIG[0].value) {
      newValue = null;
    }

    this.searchNavigatorService.navigate([{ key: SortFilterComponent.KEY_PARAMETER, value: newValue }], FILTERS_SOURCE.QUICK_FILTERS, true);

    this.closeDropdown();
  }

  public cancel(): void {
    this.closeDropdown();
  }

  private closeDropdown(): void {
    this.dropdown.close();
  }
}
