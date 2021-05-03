import { BehaviorSubject, Observable, of } from 'rxjs';

import { distinctUntilChanged, catchError, switchMap, tap, map, debounceTime } from 'rxjs/operators';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { SearchBoxValue, SuggesterResponse } from '../../core/interfaces/suggester-response.interface';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss'],
})
export class SuggesterComponent implements OnInit {
  private static SEARCH_BOX_INITIAL_VALUE = '';

  private readonly searchBoxValueSubject = new BehaviorSubject<SearchBoxValue>({ keywords: SuggesterComponent.SEARCH_BOX_INITIAL_VALUE });
  @Output() public searchSubmit = new EventEmitter<SearchBoxValue>();

  constructor(private suggesterService: SuggesterService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.onQueryParamsChange().subscribe();
  }

  get searchBoxValue(): SearchBoxValue {
    return this.searchBoxValueSubject.getValue();
  }

  get searchBoxValue$(): Observable<SearchBoxValue> {
    return this.searchBoxValueSubject.asObservable();
  }

  set searchBoxValue(keyword: SearchBoxValue) {
    this.searchBoxValueSubject.next(keyword);
  }

  public suggest = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      debounceTime(500),
      switchMap((keyword) => this.getSuggestionsByKeyword(keyword))
    );

  public inputFormatter = (value: SearchBoxValue) => value.keywords;

  public onSearchBoxValueChange(value: string | SuggesterResponse) {
    this.searchBoxValue = this.mapSearchBoxValue(value);
  }

  public onSuggestionClick(suggestion: SuggesterResponse) {
    this.searchBoxValue = this.mapSearchBoxValue(suggestion);
    this.onSearchSubmit();
  }

  public onResetKeyword(): void {
    this.searchBoxValue = this.mapSearchBoxValue(SuggesterComponent.SEARCH_BOX_INITIAL_VALUE);
    this.onSearchSubmit();
  }

  public onSearchSubmit(): void {
    this.searchSubmit.next(this.searchBoxValue);
  }

  private onQueryParamsChange(): Observable<SearchBoxValue> {
    return this.route.queryParams.pipe(
      distinctUntilChanged(),
      map((params: Params) => this.mapSearchBoxValue(params[FILTER_QUERY_PARAM_KEY.keywords])),
      tap((keyword) => (this.searchBoxValue = keyword))
    );
  }

  private getSuggestionsByKeyword(keyword: string): Observable<SuggesterResponse[]> {
    return this.suggesterService.getSuggestions(keyword).pipe(catchError(() => of([])));
  }

  private mapSearchBoxValue(value: string | SuggesterResponse): SearchBoxValue {
    if (typeof value === 'string') {
      return { keywords: value };
    }
    return {
      keywords: value.suggestion,
      category_ids: `${value.category_id}`,
    };
  }
}
