import { Injectable } from '@angular/core';
import { FilterOptionsApiService } from './filter-options-api.service';
import { FilterOptionsMapperService } from './filter-options-mapper.service';
import { QueryParams } from '../../interfaces/query-params.interface';
import { PaginationOptions } from '../../interfaces/pagination-options.interface';
import { FilterOption } from '../../interfaces/filter-option.interface';
import { OPTIONS_ORIGIN_CONFIGURATION, OriginConfigurationValue } from './configurations/options-origin-configuration';
import { ConfigurationId } from '../../types/configuration-id.type';
import { HARDCODED_OPTIONS } from './data/hardcoded-options';
import { OptionsApiOrigin } from './configurations/option-api-origin.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class FilterOptionService {
  constructor(private filterOptionsApiService: FilterOptionsApiService, private filterOptionsMapperService: FilterOptionsMapperService) {}

  public getOptions(
    configurationId: ConfigurationId,
    filterParams: QueryParams = {},
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<FilterOption[]> {
    const configuration = this.getConfiguration(configurationId);

    if (this.isHardcoded(configuration)) {
      return this.retrieveHardcodedOptions(configurationId);
    }

    return this.retrieveBackendOptions(configuration, filterParams, paginationOptions);
  }

  private isHardcoded(configuration: OriginConfigurationValue): configuration is 'hardcoded' {
    return configuration === 'hardcoded';
  }

  private getConfiguration(filterId: ConfigurationId): OriginConfigurationValue {
    return OPTIONS_ORIGIN_CONFIGURATION[filterId];
  }

  private retrieveHardcodedOptions(configurationId: ConfigurationId): Observable<FilterOption[]> {
    return new Observable((subscriber) => {
      subscriber.next(HARDCODED_OPTIONS[configurationId]);
    });
  }

  private retrieveBackendOptions(
    configuration: OptionsApiOrigin,
    filterParams?: QueryParams,
    paginationOptions?: PaginationOptions
  ): Observable<FilterOption[]> {
    const { apiMethod, mapperMethod, apiRelatedFilterKeys = [], mapperRelatedFilterKeys = [] } = configuration;

    const apiRelatedFilterValues = this.getRelatedFilterValues(apiRelatedFilterKeys);

    // In relation to the "as Observable<unknown>"
    // Magic! To avoid a build failure, we need to unify all observables on one type. If not, pipe, map... signatures break
    // For more information, this issue explains quite well the reason: https://github.com/ReactiveX/rxjs/issues/3388

    return (this.filterOptionsApiService[apiMethod](
      filterParams,
      ...apiRelatedFilterValues,
      paginationOptions?.offset.toString()
    ) as Observable<unknown>).pipe(
      map((value) => {
        if (mapperMethod) {
          const mapperRelatedFilterValues = this.getRelatedFilterValues(mapperRelatedFilterKeys);
          return this.filterOptionsMapperService[mapperMethod](value, ...mapperRelatedFilterValues);
        }

        return value as FilterOption[];
      })
    );
  }

  // TODO: This will be implemented on integration tasks. For now, it just returns the keys from the sibling filter params
  private getRelatedFilterValues(paramKeys?: string[]): string[] {
    return paramKeys;
  }
}
