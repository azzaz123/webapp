import { Injectable } from '@angular/core';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';

// TODO: This should be placed at the location filter level when implemented

@Injectable()
export class MockLocationFilterService {
  public setUserLocation(location: LabeledSearchLocation): void {}
  public getLocationLabel(location: SearchLocation) {}
  public getLocationFromBrowserAPI() {}
}
