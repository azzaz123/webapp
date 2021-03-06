import { Inject, Injectable } from '@angular/core';
import { FilterOptionsApiService } from './services/filter-options-api.service';
import { FilterOptionsMapperService } from './services/filter-options-mapper.service';
import { QueryParams } from '../../components/filters/core/interfaces/query-params.interface';
import { PaginationOptions } from '../../components/filters/core/interfaces/pagination-options.interface';
import { FilterOption } from '../../components/filters/core/interfaces/filter-option.interface';
import { OPTIONS_ORIGIN_CONFIGURATION, OriginConfigurationValue } from './configurations/options-origin-configuration';
import { ConfigurationId } from '../../components/filters/core/types/configuration-id.type';
import { HARDCODED_OPTIONS } from './data/hardcoded-options';
import { VisibilityModifierConfig, KeyMapper, OptionsApiOrigin, RequiredSiblingParam } from './interfaces/option-api-origin.interface';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import {
  HostVisibilityService,
  QueryParamVisibilityCondition,
} from '@public/shared/components/filters/components/filter-group/components/filter-host/services/host-visibility.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { PaginatedList } from '@api/core/model';
import { HttpResponse } from '@angular/common/http';

interface ExcludedFieldsOption {
  id?: string;
  excluded_fields?: string[];
}

@Injectable()
export class FilterOptionService {
  constructor(
    private filterOptionsApiService: FilterOptionsApiService,
    private filterOptionsMapperService: FilterOptionsMapperService,
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private filterParameterDraftService: FilterParameterStoreService,
    private hostVisibilityService: HostVisibilityService
  ) {}

  public getOptions(
    configurationId: ConfigurationId,
    params: QueryParams = {},
    paginationOptions: PaginationOptions = { offset: 0 }
  ): Observable<PaginatedList<FilterOption>> {
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

  private retrieveHardcodedOptions(configurationId: ConfigurationId): Observable<PaginatedList<FilterOption>> {
    return new Observable((subscriber) => {
      subscriber.next({ list: HARDCODED_OPTIONS[configurationId] });
    });
  }

  private retrieveBackendOptions(
    configuration: OptionsApiOrigin,
    params?: QueryParams,
    paginationOptions?: PaginationOptions
  ): Observable<PaginatedList<FilterOption>> {
    const { apiConfiguration, mapperConfiguration, visibilityModifierConfig } = configuration;

    const apiSiblingParams = this.getSiblingParams(apiConfiguration.requiredSiblingParams);

    const unifiedApiParams = {
      ...this.mapSiblingParams(params, apiConfiguration.keyMappers),
      ...this.mapSiblingParams(apiSiblingParams, apiConfiguration.keyMappers),
    };

    return new Observable((subscriber) => {
      this.filterOptionsApiService
        .getApiOptions(apiConfiguration.method, unifiedApiParams, paginationOptions)
        .pipe(
          map((r: HttpResponse<unknown>) => {
            const nextPage: string = r.headers?.get('x-nextpage');
            const options = r.body;

            if (visibilityModifierConfig) {
              this.handleVisibilityModifier(visibilityModifierConfig, options as ExcludedFieldsOption[]);
            }

            const paginatedResponse: PaginatedList<FilterOption, string> = {
              list: options as FilterOption[],
              paginationParameter: nextPage,
            };

            if (mapperConfiguration) {
              const mapperSiblingParams = this.getSiblingParams(mapperConfiguration.requiredSiblingParams);
              return {
                list: this.filterOptionsMapperService.formatApiResponse(
                  mapperConfiguration.method,
                  options,
                  this.mapSiblingParams(mapperSiblingParams, mapperConfiguration.keyMappers)
                ),
                paginationParameter: nextPage,
              };
            }

            return paginatedResponse;
          }),
          catchError(() => {
            return of({
              list: [],
              paginationParameter: null,
            });
          })
        )
        .subscribe((paginatedResponse: PaginatedList<FilterOption, string>) => {
          subscriber.next(paginatedResponse);
        });
    });
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

  private handleVisibilityModifier(visibilityModifierConfig: VisibilityModifierConfig, options: ExcludedFieldsOption[]): void {
    const visibilityConditions: QueryParamVisibilityCondition[] = options
      .filter((option) => option.excluded_fields?.length && option.id)
      .reduce((acc, option) => {
        const excludedFields = option.excluded_fields;

        for (const field of excludedFields) {
          const accumulatedCondition = acc.find((condition) => condition.queryParam === field);

          if (!accumulatedCondition) {
            acc.push({
              queryParam: field as FILTER_QUERY_PARAM_KEY,
              excludingParameters: [
                {
                  queryParam: visibilityModifierConfig.ownKey,
                  values: [option.id],
                },
              ],
              requiredQueryParams: [],
            });
          } else {
            const accumulatedExcludingParameter = accumulatedCondition.excludingParameters.find(
              (excludingParameter) => excludingParameter.queryParam === visibilityModifierConfig.ownKey
            );

            if (accumulatedExcludingParameter) {
              accumulatedExcludingParameter.values.push(option.id);
            } else {
              accumulatedCondition.excludingParameters.push({
                queryParam: visibilityModifierConfig.ownKey,
                values: [option.id],
              });
            }
          }
        }

        return acc;
      }, [] as QueryParamVisibilityCondition[]);

    this.hostVisibilityService.addVisibilityConditions(visibilityConditions);
  }
}
