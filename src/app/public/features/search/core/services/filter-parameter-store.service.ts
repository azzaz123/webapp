import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';
import { FilterParameterDraftService } from '@public/shared/services/filter-parameter-draft/filter-parameter-draft.service';

@Injectable()
export class FilterParameterStoreService extends FilterParameterDraftService {
  public get parameters$(): Observable<FilterParameter[]> {
    return this.getParameterObservable();
  }
}
