import { Injectable } from '@angular/core';
import { FilterParameter } from '@public/shared/components/filters/interfaces/filter-parameter.interface';

@Injectable()
export class MockSearchTrackingEventsService {
  public trackSearchEvent(searchId: string, filterParams: FilterParameter[]): void {}
}
