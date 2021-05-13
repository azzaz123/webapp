import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { LocationFilterServiceService } from '@public/features/search/core/services/location-filter-service.service';
import { Observable, of, ReplaySubject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
import { FILTER_QUERY_PARAM_KEY } from '../../../enums/filter-query-param-key.enum';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { LocationFilterConfig } from '../interfaces/location-filter-config.interface';
import { LocationFilterParams } from '../interfaces/location-filter-params.interface';

export const HERE_MAPS_ENDPOINT = 'https://image.maps.api.here.com/mia/1.6/mapview?';
export const HERE_MAPS_APP_ID = 'RgPrXX1bXt123UgUFc7B';
export const HERE_MAPS_APP_CODE = 'HtfX0DsqZ2Y0x-44GfujFA';
export const HERE_MAPS_CONFIG = `app_id=${HERE_MAPS_APP_ID}&app_code=${HERE_MAPS_APP_CODE}`;

const DISTANCE_FACTOR = 1000;
const MIN_FILTER_DISTANCE = 1;
const MAX_FILTER_DISTANCE = 500;

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  private readonly locationMapURLSubject = new ReplaySubject<string>();

  public locationFilterForm = new FormGroup({
    location: new FormGroup({
      latitude: new FormControl(),
      longitude: new FormControl(),
    }),
    locationName: new FormControl(),
    distance: new FormControl(MAX_FILTER_DISTANCE),
  });

  @Input() config: LocationFilterConfig;

  constructor(private geolocationService: GeolocationService, private locationService: LocationFilterServiceService) {
    super();
  }

  ngOnInit(): void {
    this.onLocationChange().subscribe();
    this.onDistanceChange().subscribe();
    this.onSelectLocationSuggestion().subscribe();

    super.ngOnInit();
  }

  ngOnDestroy(): void {}

  set currentLocation(location: SearchLocation) {
    this.locationFilterForm.patchValue({ location });
  }

  get currentLocation(): SearchLocation {
    const { location } = this.locationFilterForm.value;

    return location;
  }

  get currentDistance(): number {
    const { distance } = this.locationFilterForm.value;

    return distance;
  }

  set currentDistance(distance) {
    this.locationFilterForm.patchValue({ distance });
  }

  get currentLocationName(): string {
    const { locationName } = this.locationFilterForm.value;

    return locationName;
  }

  set currentLocationName(locationName: string) {
    this.locationFilterForm.patchValue({ locationName });
  }

  get locationMapURL$(): Observable<string> {
    return this.locationMapURLSubject.asObservable();
  }

  set locationMapURL(url: string) {
    this.locationMapURLSubject.next(url);
  }

  get bubbleActive() {
    return this.currentDistance !== MAX_FILTER_DISTANCE;
  }

  public onValueChange(_: FilterParameter[], currentValue: FilterParameter[]): void {
    const latitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude).value;
    const longitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.longitude).value;
    const distance = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.distance)?.value || MAX_FILTER_DISTANCE;

    this.currentLocation = { latitude, longitude };
    this.currentDistance = +distance / DISTANCE_FACTOR;
  }

  public onLocationChange() {
    return this.locationFilterForm.get('location').valueChanges.pipe(
      filter((location) => !!location),
      distinctUntilChanged(),
      switchMap((location: SearchLocation) => this.getLocationLabelFromLatitudeAndLongitude(location)),
      tap((locationName: string) => (this.currentLocationName = locationName)),
      tap((locationName: string) => (this.label = this.getBubbleLabel(locationName, this.currentDistance)))
    );
  }

  public onDistanceChange() {
    return this.locationFilterForm.get('distance').valueChanges.pipe(
      distinctUntilChanged(),
      tap((distance: number) => (this.locationMapURL = this.getLocationMapURL(this.currentLocation, distance)))
    );
  }

  public onSelectLocationSuggestion() {
    return this.locationFilterForm.get('locationName').valueChanges.pipe(
      distinctUntilChanged(),
      filter((locationName) => !!locationName),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName)),
      tap((location: SearchLocation) => (this.currentLocation = location)),
      tap((location: SearchLocation) => (this.locationMapURL = this.getLocationMapURL(location, this.currentDistance)))
    );
  }

  public handleApply(): void {
    const { latitude, longitude } = this.currentLocation;
    const label = this.currentLocationName;
    const distance = this.currentDistance;
    const parameters: FilterParameter[] = [
      { key: this.config.mapKey.latitude, value: latitude },
      { key: this.config.mapKey.longitude, value: longitude },
      { key: this.config.mapKey.distance, value: null },
    ];

    if (this.currentDistance !== MAX_FILTER_DISTANCE) {
      parameters.push({
        key: this.config.mapKey.distance,
        value: `${distance * DISTANCE_FACTOR}`,
      });
    }

    this.valueChange.emit(parameters);
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((location) => this.getLocationSuggestions(location))
    );

  public requestBrowserLocation() {
    this.locationService.getLocationFromBrowserAPI().then(
      () => {},
      (error) => {
        console.log(error.message);
      }
    );
  }

  private getBubbleLabel(locationName: string, distance: number): string {
    let label = locationName;

    if (distance && distance !== MAX_FILTER_DISTANCE) {
      label = `${distance}km · ${label}`;
    }
    return label;
  }

  private getLatitudeAndLongitudeFromLocationName(locationName: string): Observable<LabeledSearchLocation> {
    return this.geolocationService
      .geocode(locationName)
      .pipe(map((coordinate: Coordinate) => this.mapCoordinateToLabeledSearchLocation(coordinate)));
  }

  private getLocationSuggestions(locationName: string): Observable<string[]> {
    return this.geolocationService.search(locationName).pipe(
      map((locations: ItemPlace[]) => locations.map(({ description }) => description)),
      catchError(() => of([]))
    );
  }

  private getLocationLabelFromLatitudeAndLongitude(location: SearchLocation): Observable<string> {
    return this.locationService.getLocationLabel(location);
  }

  private mapCoordinateToLabeledSearchLocation(coordinate: Coordinate): LabeledSearchLocation {
    return {
      latitude: `${coordinate.latitude}`,
      longitude: `${coordinate.longitude}`,
      label: `${coordinate.name}`,
    };
  }

  private getLocationMapURL(location: SearchLocation, distance: number): string {
    const { latitude, longitude } = location;
    let zoom = 13;

    if (distance > 1 && distance <= 5) {
      zoom = 11;
    } else if (distance > 5 && distance <= 10) {
      zoom = 10;
    } else if (distance > 10 && distance <= 50) {
      zoom = 8;
    } else if (distance > 50 && distance <= 500) {
      zoom = 6;
    }

    const hereMapsParams = `&z=${zoom}&${HERE_MAPS_CONFIG}&w=700&h=270&u=${distance}k`;
    const hereMapsCoordinates = `&c=${latitude},${longitude}`;

    return HERE_MAPS_ENDPOINT + hereMapsParams + hereMapsCoordinates;
  }
}
