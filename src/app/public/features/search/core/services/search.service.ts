import { Inject, Injectable } from '@angular/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../interfaces/search-pagination.interface';
import { SearchInfrastructureService } from './infrastructure/search-infrastructure.service';
import { SearchStoreService } from './search-store.service';
import {
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { SearchQueryStringService } from '@public/features/search/core/services/search-query-string.service';

@Injectable()
export class SearchService {
  private static INITIAL_LOADING_STATE = true;
  private readonly isLoadingResultsSubject = new BehaviorSubject<boolean>(SearchService.INITIAL_LOADING_STATE);

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

  get hasMore$(): Observable<boolean> {
    return this.searchStoreService.hasMore$;
  }

  constructor(
    private searchStoreService: SearchStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private parameterStoreService: FilterParameterStoreService,
    private infrastructureService: SearchInfrastructureService,
    private queryStringService: SearchQueryStringService
  ) {}

  public init(): void {
    this.subscription.add(this.onChangeParameters().subscribe());
    this.subscription.add(this.onChangeQueryStringParameters().subscribe());
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

  private onChangeParameters(): Observable<SearchPagination> {
    return this.parameterStoreService.parameters$.pipe(
      tap((parameters: FilterParameter[]) => {
        this.queryStringService.setQueryParams(parameters);
        this.isLoadingResults = true;
      }),
      switchMap((filterParameters: FilterParameter[]) => this.infrastructureService.search(filterParameters)),
      tap(({ items, hasMore }: SearchPagination) => {
        this.isLoadingResults = false;
        this.searchStoreService.setItems(items);
        this.searchStoreService.setHasMore(hasMore);
      })
    );
  }

  private onChangeQueryStringParameters(): Observable<FilterParameter[]> {
    return this.queryStringService.queryStringParams$.pipe(
      tap((parameters: FilterParameter[]) => {
        this.parameterStoreService.setParameters(parameters);
      })
    );
  }

  private onLoadMore(): Observable<SearchPagination> {
    return this.loadMore$.pipe(
      switchMap(() => this.infrastructureService.loadMore()),
      tap(({ items, hasMore }: SearchPagination) => {
        this.searchStoreService.appendItems(items);
        this.searchStoreService.setHasMore(hasMore);
      })
    );
  }
}
