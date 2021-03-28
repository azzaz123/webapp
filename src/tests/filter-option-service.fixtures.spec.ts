import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options.interface';
import { Observable } from 'rxjs';
import { FilterOption } from '@public/shared/components/filters/core/interfaces/filter-option.interface';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { of } from 'rxjs/internal/observable/of';

export class MockFilterOptionService implements Partial<FilterOptionService> {
  public getOptions(
    configurationId: ConfigurationId,
    params?: QueryParams,
    paginationOptions?: PaginationOptions
  ): Observable<FilterOption[]> {
    switch (configurationId) {
      case COMMON_CONFIGURATION_ID.CONDITION:
        return of([
          {
            value: 'un_opened',
            label: 'Unopened',
          },
          {
            value: 'new',
            label: 'New',
          },
          {
            value: 'as_good_as_new',
            label: 'As good as new',
          },
          {
            value: 'good',
            label: 'Good condition',
          },
          {
            value: 'fair',
            label: 'Fair condition',
          },
          {
            value: 'has_given_it_all',
            label: 'Has given it all',
          },
        ]);
      case FASHION_CONFIGURATION_ID.GENDER:
        return of([
          {
            value: 'male',
            label: $localize`:@@FilterOptionGender_male:Male`,
          },
          {
            value: 'female',
            label: $localize`:@@FilterOptionGender_female:Female`,
          },
        ]);
      default:
        return of([]);
    }
  }
}
