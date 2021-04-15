import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Injectable()
export class FilterParameterDraftService {
  private parametersSubject = new BehaviorSubject<FilterParameter[]>([]);

  protected getParameterObservable(): Observable<FilterParameter[]> {
    return this.parametersSubject.asObservable();
  }

  public getParameters(): FilterParameter[] {
    return this.parametersSubject.value;
  }

  public getParametersByKeys(keys: string[]): FilterParameter[] {
    return this.getParameters().filter((parameter) => keys.includes(parameter.key));
  }

  public setParameters(parameters: FilterParameter[]): void {
    this.parametersSubject.next(parameters.filter((parameter) => parameter.value));
  }

  public upsertParameters(parameters: FilterParameter[]): void {
    const mergedParameters = this.mergeParameters(parameters, this.getParameters());
    this.setParameters(mergedParameters);
  }

  public removeParameters(parameters: FilterParameter[]): void {
    const keysToRemove = parameters.map((parameter) => parameter.key);
    const nextParameters = this.getParameters().filter((parameter) => {
      return !keysToRemove.includes(parameter.key);
    });
    this.setParameters(nextParameters);
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
