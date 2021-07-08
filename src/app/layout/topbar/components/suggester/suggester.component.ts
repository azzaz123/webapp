import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';

import { distinctUntilChanged, catchError, switchMap, tap, map, debounceTime, filter } from 'rxjs/operators';
import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { SearchBoxValue, SuggesterResponse } from '../../core/interfaces/suggester-response.interface';
import { SuggesterService } from '@layout/topbar/core/services/suggester.service';
import { ActivatedRoute, Params } from '@angular/router';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

@Component({
  selector: 'tsl-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss'],
})
export class SuggesterComponent implements OnInit, OnDestroy {
  private static SEARCH_BOX_INITIAL_VALUE = '';
  private readonly searchBoxValueSubject = new BehaviorSubject<SearchBoxValue>({ keywords: SuggesterComponent.SEARCH_BOX_INITIAL_VALUE });
  private queryParamsSubscription: Subscription;
  private searching = false;

  @Output() public searchSubmit = new EventEmitter<SearchBoxValue>();
  @Output() public searchCancel = new EventEmitter<SearchBoxValue>();

  constructor(private suggesterService: SuggesterService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.queryParamsSubscription = this.onQueryParamsChange().subscribe();
  }

  ngOnDestroy() {
    this.queryParamsSubscription.unsubscribe();
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
      tap(() => (this.searching = true)),
      debounceTime(500),
      filter(() => this.searching),
      switchMap((keyword) => this.getSuggestionsByKeyword(keyword)),
      tap(() => (this.searching = false))
    );

  public inputFormatter = (value: SearchBoxValue) => value.keywords;

  public searchBoxValueChange(value: string | SuggesterResponse) {
    this.searchBoxValue = this.mapSearchBoxValue(value);
  }

  public suggestionClick(suggestion: SuggesterResponse) {
    this.searchBoxValue = this.mapSearchBoxValue(suggestion);
    this.submitSearch();
  }

  public resetKeyword(): void {
    this.searchCancel.emit(this.searchBoxValue);
    this.searchBoxValue = this.mapSearchBoxValue(SuggesterComponent.SEARCH_BOX_INITIAL_VALUE);
  }

  public submitSearch(): void {
    this.searching = false;
    this.searchSubmit.emit(this.searchBoxValue);
  }

  private onQueryParamsChange(): Observable<SearchBoxValue> {
    return this.route.queryParams.pipe(
      distinctUntilChanged(),
      map((params: Params) => params[FILTER_QUERY_PARAM_KEY.keywords]),
      map((keyword: string) => this.mapSearchBoxValue(keyword)),
      tap((searchBoxValue: SearchBoxValue) => (this.searchBoxValue = searchBoxValue))
    );
  }

  private getSuggestionsByKeyword(keyword: string): Observable<SuggesterResponse[]> {
    return this.suggesterService.getSuggestions(keyword).pipe(catchError(() => of([])));
  }

  private mapSearchBoxValue(value: string | SuggesterResponse): SearchBoxValue {
    if (typeof value === 'object') {
      const searchBoxValue = { [FILTER_QUERY_PARAM_KEY.keywords]: value.suggestion };

      if (value.category_id) {
        searchBoxValue[FILTER_QUERY_PARAM_KEY.categoryId] = `${value.category_id}`;
      }
      return searchBoxValue;
    }
    return { [FILTER_QUERY_PARAM_KEY.keywords]: value };
  }
}
