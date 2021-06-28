import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SELECT_FORM_OPTIONS_CONFIG } from './sort-filter.config';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'tsl-sort-filter',
  templateUrl: 'sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent implements OnInit {
  private static KEY_PARAMETER: FILTER_QUERY_PARAM_KEY = FILTER_QUERY_PARAM_KEY.orderBy;
  public selectFormOptionsConfig: SelectFormOption<string>[] = SELECT_FORM_OPTIONS_CONFIG;
  public formControl: FormControl;

  public selected: SelectFormOption<string>;

  @ViewChild(NgbDropdown, { static: false }) public dropdown: NgbDropdown;

  @Output() toggleBubble: EventEmitter<boolean> = new EventEmitter<boolean>();

  private static getSelectedValue(actualValue: string): SelectFormOption<string> {
    return SELECT_FORM_OPTIONS_CONFIG.find(({ value }: SelectFormOption<string>) => value === actualValue);
  }

  constructor(private searchNavigatorService: SearchNavigatorService, private activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.formControl = new FormControl(this.selectFormOptionsConfig[0].value);
    this.selected = SortFilterComponent.getSelectedValue(this.initialValue);
  }

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

  get initialValue(): string {
    return this.activatedRoute.snapshot.queryParams[FILTER_QUERY_PARAM_KEY.orderBy] || this.selectFormOptionsConfig[0].value;
  }
}
