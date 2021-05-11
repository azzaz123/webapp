import { Inject, Injectable } from '@angular/core';
import {
  FilterParameterStoreService,
  FILTER_PARAMETER_STORE_TOKEN,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';

@Injectable()
export class SearchTrackingEventsService {
  constructor(@Inject(FILTER_PARAMETER_STORE_TOKEN) private filterParameterStoreService: FilterParameterStoreService) {}

  /*  public trackSearchEvent(): void {
    console.log('search');
  
    console.log('parameters', parameters);
  } */

  public topBarTrackSearchEvent(searchValue) {
    let parameters = this.filterParameterStoreService.getParameters();
    console.log('track searcg', searchValue, parameters);
  }
}
