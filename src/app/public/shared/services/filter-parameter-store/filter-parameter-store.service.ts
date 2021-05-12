import { InjectionToken } from '@angular/core';
import { FILTER_SOURCE } from '@public/features/search/core/services/enums/filter-source.enum';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { Subject } from 'rxjs';

export const FILTER_PARAMETER_STORE_TOKEN = new InjectionToken<string>('filterParameterStore');
export const FILTER_PARAMETER_DRAFT_STORE_TOKEN = new InjectionToken<string>('filterParameterDraftStore');

export class FilterParameterStoreService {
  private static INITIAL_PARAMETERS: FilterParameter[] = [];
  private static filterSource: FILTER_SOURCE;

  private parameters: FilterParameter[] = [];
  private parametersSubject = new Subject<FilterParameter[]>();
  public parameters$ = this.parametersSubject.asObservable();

  public getParameters(): FilterParameter[] {
    return this.parameters;
  }

  public getFilterSource(): FILTER_SOURCE {
    return FilterParameterStoreService.filterSource;
  }

  public getParametersByKeys(keys: string[]): FilterParameter[] {
    return this.getParameters().filter((parameter) => keys.includes(parameter.key));
  }

  public setParameters(parameters: FilterParameter[]): void {
    this.parameters = parameters;
    this.parametersSubject.next(parameters.filter((parameter) => parameter.value));
  }

  public upsertParameters(parameters: FilterParameter[], filterSource: FILTER_SOURCE): void {
    const mergedParameters = this.mergeParameters(parameters, this.getParameters());
    this.setParameters(mergedParameters);
    this.setFilterResource(filterSource);
  }

  public removeParameters(parameters: FilterParameter[]): void {
    const keysToRemove = parameters.map((parameter) => parameter.key);
    const nextParameters = this.getParameters().filter((parameter) => {
      return !keysToRemove.includes(parameter.key);
    });
    this.setParameters(nextParameters);
  }

  public clear(): void {
    this.parametersSubject.next(FilterParameterStoreService.INITIAL_PARAMETERS);
  }

  private setFilterResource(filterSource: FILTER_SOURCE) {
    FilterParameterStoreService.filterSource = filterSource;
  }

  private mergeParameters(newParameters: FilterParameter[], oldParameters: FilterParameter[]): FilterParameter[] {
    return [...newParameters, ...oldParameters].reduce((accumulatedParameters, newParameter) => {
      const accumulatedKeys = accumulatedParameters.map((parameter) => parameter.key);
      if (accumulatedKeys.includes(newParameter.key)) {
        return accumulatedParameters;
      }

      return [...accumulatedParameters, newParameter];
    }, []);
  }
}
