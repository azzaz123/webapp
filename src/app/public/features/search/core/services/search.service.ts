import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Observable, Subject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { SearchPagination } from '../../interfaces/search-pagination.interface';
import { FilterParameterStoreService } from './filter-parameter-store.service';
import { SearchInfrastructureService } from './infrastructure/search-infrastructure.service';
import { SearchStoreService } from './search-store.service';

@Injectable()
export class SearchService {
  private searchSubject: Subject<void> = new Subject<void>();
  private loadMoreSubject: Subject<void> = new Subject<void>();

  private get search$(): Observable<void> {
    return this.searchSubject.asObservable();
  }

  private get loadMore$(): Observable<void> {
    return this.loadMoreSubject.asObservable();
  }

  constructor(
    private searchStoreService: SearchStoreService,
    private filterParameterStoreService: FilterParameterStoreService,
    private searchInfrastructureService: SearchInfrastructureService
  ) {
    this.init();
  }

  public search(): void {
    this.searchSubject.next();
  }

  public loadMore(): void {
    this.loadMoreSubject.next();
  }

  private init(): void {
    this.onSearch().subscribe();

    this.onLoadMore().subscribe();
  }

  private onSearch(): Observable<SearchPagination> {
    return this.search$.pipe(
      switchMap(() => this.filterParameterStoreService.parameters$),
      switchMap((filterParameters: FilterParameter[]) => this.searchInfrastructureService.search(filterParameters)),
      tap(({ items }: SearchPagination) => this.searchStoreService.setItems(items))
    );
  }

  private onLoadMore(): Observable<SearchPagination> {
    return this.loadMore$.pipe(
      switchMap(() => this.searchInfrastructureService.loadMore()),
      tap(({ items }: SearchPagination) => this.searchStoreService.appendItems(items))
    );
  }
}
