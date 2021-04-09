import { FilterOptionService } from '@public/shared/services/filter-option/filter-option.service';
import { ConfigurationId } from '@public/shared/components/filters/core/types/configuration-id.type';
import { QueryParams } from '@public/shared/components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '@public/shared/components/filters/core/interfaces/pagination-options.interface';
import { Observable } from 'rxjs';
import { FilterOption } from '@public/shared/components/filters/core/interfaces/filter-option.interface';
import { COMMON_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/common-configuration-ids.enum';
import { FASHION_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/fashion-configuration-ids.enum';
import { of } from 'rxjs/internal/observable/of';
import { CAR_CONFIGURATION_ID } from '@public/shared/components/filters/core/enums/configuration-ids/car-configuration-ids';

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
            label: 'Male',
          },
          {
            value: 'female',
            label: 'Female',
          },
        ]);
      case CAR_CONFIGURATION_ID.BRAND_N_MODEL:
        return of(this.getOptionsByText(params, true));
      case COMMON_CONFIGURATION_ID.OBJECT_TYPE:
        params = params || {};
        return of(this.getOptionsByText(params));
      default:
        return of([]);
    }
  }

  private getOptionsByText(params?: QueryParams, isComplex?: boolean): FilterOption[] {
    if (params) {
      const { text = 'default' } = params;
      const arr = new Array(30).fill(undefined);
      return arr.map((a, index) => {
        const value = isComplex ? { brand: `${text}_brand_${index}`, model: `${text}_model_${index}` } : `${text}_${index}`;
        const label = isComplex ? `${text}_brand_${index}, ${text}_model_${index}` : `${text}_${index}`;
        return {
          label,
          value,
        };
      });
    }
    return [];
  }
}