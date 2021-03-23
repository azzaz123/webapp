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
    this.parametersSubject.next(parameters);
  }

  public upsertParameters(parameters: FilterParameter[]): void {
    const mergedParameters = this.mergeParameters(parameters, this.getParameters());
    this.parametersSubject.next(mergedParameters);
  }

  public removeParameters(parameters: FilterParameter[]): void {
    const currentParameters = this.getParameters();

    parameters.forEach((parameter: FilterParameter) => {
      currentParameters.forEach((_parameter: FilterParameter, index: number) => {
        if (parameter.key === _parameter.key) {
          currentParameters.splice(index, 1);
        }
      });
    });

    this.parametersSubject.next(currentParameters);
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
