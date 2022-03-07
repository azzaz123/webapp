import { Component, Inject, Input, LOCALE_ID } from '@angular/core';
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

@Component({
  selector: 'tsl-category-cards',
  templateUrl: './category-cards.component.html',
  styleUrls: ['./category-cards.component.scss'],
})
export class CategoryCardsComponent {
  @Input() categoryId: string;
  @Input() objectTypeId: string;
  @Input() title: string = 'HOLA';

  public token: string;

  constructor(
    @Inject(LOCALE_ID) public locale: APP_LOCALE,
    private accessTokenService: AccessTokenService,
    private searchNavigatorService: SearchNavigatorService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService
  ) {
    this.token = this.accessTokenService.accessToken;
  }

  public cardClick($event: CustomEvent): void {
    const id = $event.detail.id;
    const parameters = this.filterParameterStoreService.getParameters();

    // ** Prep of the parameters to work with the searchNavigatorService that will be removed soon, so I will let this in standby
    // until the new navigation flow is merged

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

    // ** TODO waiting for PR
    // this.searchNavigatorService.navigate(parameters, FILTERS_SOURCE.DEFAULT_FILTERS); // incorrect source

    this.sentBrowseTrackingEvent();
  }

  private sentBrowseTrackingEvent(): void {
    // TODO waiting for product
  }
}
