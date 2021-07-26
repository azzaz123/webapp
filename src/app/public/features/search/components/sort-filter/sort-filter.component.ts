import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { SortByService } from './services/sort-by.service';
import { SORT_BY, SORT_BY_DISTANCE_OPTION, SORT_BY_RELEVANCE_OPTION } from './services/constants/sort-by-options-constants';

@Component({
  selector: 'tsl-sort-filter',
  templateUrl: 'sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortFilterComponent implements OnInit {
  private static KEY_PARAMETER: FILTER_QUERY_PARAM_KEY = FILTER_QUERY_PARAM_KEY.orderBy;
  private defaultValue: SORT_BY = SORT_BY_DISTANCE_OPTION.value;
  public options: SelectFormOption<SORT_BY>[] = [];
  public formControl: FormControl = new FormControl(this.defaultValue);
  public selected: SelectFormOption<SORT_BY>;

  @ViewChild(NgbDropdown, { static: false }) public dropdown: NgbDropdown;
  @Output() toggleBubble: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() set value(value: SORT_BY) {
    const selected = this.getSelectedValue(value);
    if (selected) {
      this.selected = selected;
      this.formControl.setValue(value, { emitEvent: false });
    }
  }

  private getSelectedValue(actualValue: string): SelectFormOption<SORT_BY> {
    return this.options.find(({ value }) => value === actualValue);
  }

  constructor(private searchNavigatorService: SearchNavigatorService, private sortByService: SortByService) {
    this.sortByService.options$.subscribe((options) => {
      this.options = options;
    });

    this.sortByService.isRelevanceOptionActive$.subscribe((isRelevanceOptionActive) => {
      if (!isRelevanceOptionActive && this.selected?.value === SORT_BY_RELEVANCE_OPTION.value) {
        this.onChangeValue(this.defaultValue);
        this.formControl.setValue(this.defaultValue);
      }
    });
  }

  ngOnInit() {
    this.initData();
  }

  private initData() {
    this.formControl = new FormControl(this.selected?.value || this.options[0]?.value);
    this.selected = this.getSelectedValue(this.formControl.value);
    this.formControl.valueChanges.subscribe((value: SORT_BY) => {
      this.onChangeValue(value);
    });
  }

  public openChange(event: boolean): void {
    this.toggleBubble.emit(event);
  }

  public onChangeValue(newValue: string): void {
    this.selected = this.getSelectedValue(newValue);
    this.searchNavigatorService.navigate([{ key: SortFilterComponent.KEY_PARAMETER, value: newValue }], FILTERS_SOURCE.QUICK_FILTERS, true);

    this.closeDropdown();
  }

  public cancel(): void {
    this.closeDropdown();
  }

  private closeDropdown(): void {
    this.dropdown?.close();
  }
}
