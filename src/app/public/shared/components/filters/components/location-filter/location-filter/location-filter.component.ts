import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { GeolocationResponse, ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { LocationFilterServiceService } from '@public/features/search/core/services/location-filter-service.service';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
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

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  private readonly labeledSearchLocationSubject = new BehaviorSubject<LabeledSearchLocation>(null);
  private readonly searchLocationSubject = new BehaviorSubject<SearchLocation>(null);
  private readonly locationMapURLSubject = new BehaviorSubject<string>(null);
  private readonly selectedLocationSuggestionSubject = new Subject<ItemPlace>();

  public distanceControl: FormControl = new FormControl(500);

  @Input() config: LocationFilterConfig;

  constructor(private geolocationService: GeolocationService, private locationService: LocationFilterServiceService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.onSelectSuggestion().subscribe();
    this.onSearchLocationChange().subscribe();
    this.onDistanceChange().subscribe();
  }

  ngOnDestroy(): void {}

  get searchLocation(): SearchLocation {
    return this.searchLocationSubject.getValue();
  }

  get searchLocation$(): Observable<SearchLocation> {
    return this.searchLocationSubject.asObservable();
  }

  set searchLocation(location: SearchLocation) {
    this.searchLocationSubject.next(location);
  }

  get locationMapURL(): string {
    return this.locationMapURLSubject.getValue();
  }

  get locationMapURL$(): Observable<string> {
    return this.locationMapURLSubject.asObservable();
  }

  set locationMapURL(url: string) {
    this.locationMapURLSubject.next(url);
  }

  get labeledSearchLocation(): LabeledSearchLocation {
    return this.labeledSearchLocationSubject.getValue();
  }

  get labeledSearchLocation$(): Observable<LabeledSearchLocation> {
    return this.labeledSearchLocationSubject.asObservable();
  }

  set labeledSearchLocation(location: LabeledSearchLocation) {
    this.labeledSearchLocationSubject.next(location);
  }

  get selectedLocationSuggestion$(): Observable<ItemPlace> {
    return this.selectedLocationSuggestionSubject.asObservable();
  }

  set selectedLocationSuggestion(suggestion: ItemPlace) {
    this.selectedLocationSuggestionSubject.next(suggestion);
  }

  public inputFormatter = (location: LabeledSearchLocation) => location.label;

  public handleApply() {
    const { latitude, longitude, label } = this.labeledSearchLocation;
    const distance = this.distanceControl.value;

    this.valueChange.emit([
      { key: this.config.mapKey.latitude, value: latitude },
      { key: this.config.mapKey.longitude, value: longitude },
      { key: this.config.mapKey.distance, value: `${distance * 100}` },
    ]);
    this.locationService.setUserLocation({ latitude, longitude, label });
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((location) => this.getLocationSuggestions(location))
    );

  public onSelectSuggestion(): Observable<LabeledSearchLocation> {
    return this.selectedLocationSuggestion$.pipe(
      filter((location) => !!location),
      map((selectedLocation: ItemPlace) => selectedLocation.description),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName)),
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location)),
      tap(({ latitude, longitude }) => (this.locationMapURL = this.getLocationMapURL({ latitude, longitude })))
    );
  }

  public onSearchLocationChange() {
    return this.searchLocation$.pipe(
      filter((location) => !!location),
      tap(({ latitude, longitude }) => (this.locationMapURL = this.getLocationMapURL({ latitude, longitude }))),
      switchMap((location: SearchLocation) =>
        this.getLocationLabelFromLatitudeAndLongitude(location).pipe(
          map((label: string) =>
            this.mapSearchLocationToLabeledSearchLocation({ latitude: location.latitude, longitude: location.longitude, label })
          )
        )
      ),
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location)),
      tap(() => this.setBubbleLabel())
    );
  }

  private onDistanceChange() {
    return this.distanceControl.valueChanges.pipe(
      filter((searchLocation) => !!searchLocation),
      tap(() => this.getLocationMapURL({ latitude: this.searchLocation.latitude, longitude: this.searchLocation.longitude }))
    );
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    const latitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude).value;
    const longitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.longitude).value;
    const distance = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.distance)?.value || 500;

    if (distance) {
      this.distanceControl.setValue(+distance / 100);
    }
    this.searchLocation = { latitude, longitude };
  }

  public selectLocationSuggestion(suggestion: ItemPlace) {
    this.selectedLocationSuggestion = suggestion;
  }

  public requestBrowserLocation() {
    this.locationService.getLocationFromBrowserAPI();
  }

  private setBubbleLabel() {
    const distance = this.distanceControl.value;
    const { label } = this.labeledSearchLocation;

    if (distance) {
      this.label = `${distance / 100}km · ${label}`;
    } else {
      this.label = label;
    }
  }

  private getLatitudeAndLongitudeFromLocationName(locationName: string): Observable<LabeledSearchLocation> {
    return this.geolocationService
      .geocode(locationName)
      .pipe(map((coordinate: Coordinate) => this.mapCoordinateToLabeledSearchLocation(coordinate)));
  }

  private getLocationSuggestions(locationName: string): Observable<GeolocationResponse[]> {
    return this.geolocationService.search(locationName).pipe(catchError(() => of([])));
  }

  private getLocationLabelFromLatitudeAndLongitude({ latitude, longitude }): Observable<string> {
    return this.locationService.getLocationLabel({ latitude, longitude });
  }

  private mapSearchLocationToLabeledSearchLocation({ latitude, longitude, label }): LabeledSearchLocation {
    return { latitude, longitude, label };
  }

  private mapCoordinateToLabeledSearchLocation(coordinate: Coordinate): LabeledSearchLocation {
    return {
      latitude: `${coordinate.latitude}`,
      longitude: `${coordinate.longitude}`,
      label: `${coordinate.name}`,
    };
  }

  private getLocationMapURL({ latitude, longitude }): string {
    const distance = this.distanceControl.value;
    let zoom = 1;

    if (distance > 1000 && distance <= 5000) {
      zoom = 11;
    } else if (distance > 5000 && distance <= 10000) {
      zoom = 10;
    } else if (distance > 10000 && distance <= 50000) {
      zoom = 8;
    } else if (distance > 50000 && distance <= 500000) {
      zoom = 6;
    } else {
      zoom = 13;
    }

    const hereMapsParams = `&z=${zoom}&${HERE_MAPS_CONFIG}&w=700&h=270&u=${distance / 100}k`;
    const hereMapsCoordinates = `&c=${latitude},${longitude}`;

    return HERE_MAPS_ENDPOINT + hereMapsParams + hereMapsCoordinates;
  }
}
