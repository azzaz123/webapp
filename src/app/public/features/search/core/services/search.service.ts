import { Inject, Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SearchPagination, SearchPaginationWithCategory } from '../../interfaces/search-pagination.interface';
import { SearchInfrastructureService } from './infrastructure/search-infrastructure.service';
import { SearchStoreService } from './search-store.service';
import {
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { SearchResponseExtraData } from './interfaces/search-response-extra-data.interface';

@Injectable()
export class SearchService {
  private static INITIAL_LOADING_STATE = true;
  private static INITIAL_PAGINATION_LOADING_STATE = false;
  private readonly isLoadingResultsSubject = new BehaviorSubject<boolean>(SearchService.INITIAL_LOADING_STATE);
  private readonly isLoadingPaginationResultsSubject = new BehaviorSubject<boolean>(SearchService.INITIAL_PAGINATION_LOADING_STATE);
  private readonly currentCategoryIdSubject = new BehaviorSubject<string>(undefined);
  private readonly searchResponseExtraDataSubject = new BehaviorSubject<SearchResponseExtraData>(null);

  private subscription: Subscription = new Subscription();

  private loadMoreSubject: Subject<void> = new Subject<void>();

  private get loadMore$(): Observable<void> {
    return this.loadMoreSubject.asObservable();
  }

  get items$(): Observable<ItemCard[]> {
    return this.searchStoreService.items$;
  }

  get isLoadingResults$(): Observable<boolean> {
    return this.isLoadingResultsSubject.asObservable();
  }

  private set isLoadingResults(loading: boolean) {
    this.isLoadingResultsSubject.next(loading);
  }

  get isLoadingPaginationResults$(): Observable<boolean> {
    return this.isLoadingPaginationResultsSubject.asObservable();
  }

  private set isLoadingPaginationResults(loading: boolean) {
    this.isLoadingPaginationResultsSubject.next(loading);
  }

  get hasMore$(): Observable<boolean> {
    return this.searchStoreService.hasMore$;
  }

  public isWall$: Observable<boolean> = this.parameterStoreService.parameters$.pipe(
    map((filterParameters: FilterParameter[]) =>
      filterParameters.find(({ key }: FilterParameter) => key === FILTER_QUERY_PARAM_KEY.keywords)
    ),
    map((filterKeyowrd: FilterParameter) => !filterKeyowrd)
  );

  get currentCategoryId$(): Observable<string> {
    return this.currentCategoryIdSubject.asObservable();
  }

  private set currentCategoryId(categoryId: string) {
    this.currentCategoryIdSubject.next(categoryId);
  }

  get newSearch$(): Observable<SearchResponseExtraData> {
    return this.searchResponseExtraDataSubject.asObservable();
  }

  private set searchResponseExtraData(searchResponseExtraData: SearchResponseExtraData) {
    this.searchResponseExtraDataSubject.next(searchResponseExtraData);
  }

  constructor(
    private searchStoreService: SearchStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private parameterStoreService: FilterParameterStoreService,
    private infrastructureService: SearchInfrastructureService
  ) {}

  public init(): void {
    this.subscription.add(this.onChangeParameters().subscribe());
    this.subscription.add(this.onLoadMore().subscribe());
  }

  public loadMore(): void {
    this.loadMoreSubject.next();
  }

  public close(): void {
    this.subscription.unsubscribe();
    this.searchStoreService.clear();
    this.parameterStoreService.clear();
  }

  private onChangeParameters(): Observable<SearchPaginationWithCategory> {
    return this.parameterStoreService.parameters$.pipe(
      tap(() => {
        this.isLoadingResults = true;
      }),
      switchMap((filterParameters: FilterParameter[]) =>
        this.infrastructureService.search(filterParameters).pipe(
          map((r) => {
            return this.mapSearchResponse(r, filterParameters);
          })
        )
      ),
      tap(({ items, hasMore, categoryId, searchId, sortBy }: SearchPaginationWithCategory) => {
        this.isLoadingResults = false;
        this.currentCategoryId = categoryId;
        this.searchResponseExtraData = { searchId, sortBy };
        this.searchStoreService.setItems(items);
        this.searchStoreService.setHasMore(hasMore);
      })
    );
  }

  private onLoadMore(): Observable<SearchPagination> {
    return this.loadMore$.pipe(
      tap(() => (this.isLoadingPaginationResults = true)),
      switchMap(() => this.infrastructureService.loadMore()),
      tap(({ items, hasMore }: SearchPagination) => {
        this.isLoadingPaginationResults = false;
        this.searchStoreService.appendItems(items);
        this.searchStoreService.setHasMore(hasMore);
      })
    );
  }

  private mapSearchResponse(pagination: SearchPagination, filterParameters: FilterParameter[]): SearchPaginationWithCategory {
    const { items, hasMore, searchId, sortBy } = pagination;
    return {
      items,
      hasMore,
      searchId,
      categoryId: this.getCategoryIdFromParams(filterParameters),
      sortBy,
    };
  }

  private getCategoryIdFromParams(filterParameters: FilterParameter[]) {
    return filterParameters.find((param) => param.key === FILTER_QUERY_PARAM_KEY.categoryId)?.value;
  }
}
