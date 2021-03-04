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
    params: QueryParams = {},
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<FilterOption[]> {
    const configuration = this.getConfiguration(configurationId);

    if (this.isHardcoded(configuration)) {
      return this.retrieveHardcodedOptions(configurationId);
    }

    return this.retrieveBackendOptions(configuration, params, paginationOptions);
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
    params?: QueryParams,
    paginationOptions?: PaginationOptions
  ): Observable<FilterOption[]> {
    const { apiMethod, mapperMethod, apiRelatedParamKeys = [], mapperRelatedParamKeys = [] } = configuration;

    const apiRelatedParams = this.getRelatedFilterParams(apiRelatedParamKeys);

    // In relation to the "as Observable<unknown>"
    // Magic! To avoid a build failure, we need to unify all observables on one type. If not, pipe, map... signatures break
    // For more information, this issue explains quite well the reason: https://github.com/ReactiveX/rxjs/issues/3388

    return (this.filterOptionsApiService[apiMethod](params, ...apiRelatedParams, paginationOptions?.offset.toString()) as Observable<
      unknown
    >).pipe(
      map((value) => {
        if (mapperMethod) {
          const mapperRelatedParams = this.getRelatedFilterParams(mapperRelatedParamKeys);
          return this.filterOptionsMapperService[mapperMethod](value, ...mapperRelatedParams);
        }

        return value as FilterOption[];
      })
    );
  }

  // TODO: This will be implemented on integration tasks. For now, it just returns the keys from the sibling filter params
  private getRelatedFilterParams(paramKeys?: string[]): string[] {
    return paramKeys;
  }
}
