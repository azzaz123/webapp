import { Injectable } from '@angular/core';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
@Injectable()
export class MockLocationFilterService {
  public setUserLocation(location: LabeledSearchLocation): void {}
  public getLocationLabel(location: SearchLocation): void {}
  public getLocationFromBrowserAPI(): void {}
}
