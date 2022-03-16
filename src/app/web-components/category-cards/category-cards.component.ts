import {
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Inject,
  Input,
  LOCALE_ID,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { APP_LOCALE } from '@configs/subdomains.config';
import { AccessTokenService } from '@core/http/access-token.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import {
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import '@wallapop-web-components/category-cards/category-cards.dev.js';
import { CategoriesApiService } from '@api/categories/categories-api.service';
import { FILTERS_SOURCE } from '@public/core/services/search-tracking-events/enums/filters-source-enum';
import { CategoryWithPresentation } from '@core/category/category-with-presentation.interface';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
/* eslint-disable  @typescript-eslint/member-ordering */

@Component({
  selector: 'tsl-category-cards',
  templateUrl: './category-cards.component.html',
  styleUrls: ['./category-cards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCardsComponent implements OnChanges {
  @Input() categoryId: string;
  @Input() objectTypeId: string;

  @ViewChild('scrollWrapper') scrollWrapper: ElementRef;

  private titleSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private categoryCardsEmptySubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public title$: Observable<string> = this.titleSubject.asObservable();
  public categoryCardsEmpty$: Observable<boolean> = this.categoryCardsEmptySubject.asObservable();
  public token: string;

  constructor(
    @Inject(LOCALE_ID) public locale: APP_LOCALE,
    private accessTokenService: AccessTokenService,
    private searchNavigatorService: SearchNavigatorService,
    private categoriesApiService: CategoriesApiService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService
  ) {
    this.token = this.accessTokenService.accessToken;
  }

  ngOnChanges(): void {
    if (!this.categoryId && !this.objectTypeId) {
      this.titleSubject.next('');
    } else {
      this.categoriesApiService
        .getCategoryWithPresentationById(this.objectTypeId ? +this.objectTypeId : +this.categoryId)
        .subscribe((category: CategoryWithPresentation) => {
          this.titleSubject.next(category?.name);
          this.resetScroll();
        });
    }
  }

  public setCategoryCardsEmpty($event: CustomEvent): void {
    this.categoryCardsEmptySubject.next($event.detail.empty);
  }

  public cardClick($event: CustomEvent): void {
    const id = $event.detail.id;
    const parameters = this.filterParameterStoreService.getParameters();

    if (!this.categoryId && !this.objectTypeId) {
      parameters.push({ key: FILTER_QUERY_PARAM_KEY.categoryId, value: id });
      this.categoryId = id;
    } else if (this.categoryId && !this.objectTypeId) {
      parameters.push({ key: FILTER_QUERY_PARAM_KEY.objectType, value: id });
    } else if (this.categoryId && this.objectTypeId) {
      parameters.map((filter: FilterParameter) => {
        if (filter.key === FILTER_QUERY_PARAM_KEY.objectType) {
          filter.value = id;
        }
      });

      this.objectTypeId = id;
    }

    this.searchNavigatorService.navigate(parameters, FILTERS_SOURCE.SUBCATEGORY_SLIDER);

    this.sentBrowseTrackingEvent();
  }

  private sentBrowseTrackingEvent(): void {
    // TODO waiting for product
  }

  private resetScroll(): void {
    this.scrollWrapper.nativeElement.scroll(0, 0);
  }
}
