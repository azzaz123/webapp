import { Inject, Injectable } from '@angular/core';
import { FilterOptionsApiService } from './services/filter-options-api.service';
import { FilterOptionsMapperService } from './services/filter-options-mapper.service';
import { QueryParams } from '../../components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '../../components/filters/core/interfaces/pagination-options.interface';
import { FilterOption } from '../../components/filters/core/interfaces/filter-option.interface';
import { OPTIONS_ORIGIN_CONFIGURATION, OriginConfigurationValue } from './configurations/options-origin-configuration';
import { ConfigurationId } from '../../components/filters/core/types/configuration-id.type';
import { HARDCODED_OPTIONS } from './data/hardcoded-options';
import { KeyMapper, OptionsApiOrigin, RequiredSiblingParam } from './interfaces/option-api-origin.interface';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';

@Injectable()
export class FilterOptionService {
  constructor(
    private filterOptionsApiService: FilterOptionsApiService,
    private filterOptionsMapperService: FilterOptionsMapperService,
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private filterParameterDraftService: FilterParameterStoreService
  ) {}

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
    const { apiConfiguration, mapperConfiguration } = configuration;

    const apiSiblingParams = this.getSiblingParams(apiConfiguration.requiredSiblingParams);

    const unifiedApiParams = {
      ...this.mapSiblingParams(params, apiConfiguration.keyMappers),
      ...this.mapSiblingParams(apiSiblingParams, apiConfiguration.keyMappers),
    };

    return this.filterOptionsApiService.getApiOptions(apiConfiguration.method, unifiedApiParams, paginationOptions).pipe(
      map((value: FilterOption[]) => {
        if (mapperConfiguration) {
          const mapperSiblingParams = this.getSiblingParams(mapperConfiguration.requiredSiblingParams);
          return this.filterOptionsMapperService.formatApiResponse(
            mapperConfiguration.method,
            value,
            this.mapSiblingParams(mapperSiblingParams, mapperConfiguration.keyMappers)
          );
        }

        return value;
      })
    );
  }

  private mapSiblingParams(relatedParams: Record<string, string> = {}, keyMappers: KeyMapper[] = []): Record<string, string> {
    const mappedParams = { ...relatedParams };

    keyMappers.filter(this.isKeyMapper).forEach((mapper) => {
      const { destinationParamKey, sourceParamKey } = mapper;

      if (relatedParams[sourceParamKey]) {
        mappedParams[destinationParamKey] = relatedParams[sourceParamKey];
        delete mappedParams[sourceParamKey];
      }
    });

    return mappedParams;
  }

  private getSiblingParams(params: RequiredSiblingParam[] = []): Record<string, string> {
    if (params.length) {
      const paramKeys = params.map((param) => param.key);

      const defaultParams = params.reduce((accumulatedParams, defaultParam) => {
        if (defaultParam.defaultValue) {
          return {
            ...accumulatedParams,
            [defaultParam.key]: defaultParam.defaultValue,
          };
        }
        return accumulatedParams;
      }, {});

      return this.filterParameterDraftService.getParametersByKeys(paramKeys).reduce(
        (accumulatedParams, filterParameter) => ({
          ...accumulatedParams,
          [filterParameter.key]: filterParameter.value,
        }),
        defaultParams
      );
    }

    return {};
  }

  private isKeyMapper(mapper: KeyMapper | string): mapper is KeyMapper {
    return typeof mapper !== 'string';
  }
}
