import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { GeolocationResponse, ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { LocationFilterServiceService } from '@public/features/search/core/services/location-filter-service.service';
import { combineLatest, Observable, of, ReplaySubject, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
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
const MIN_FILTER_DISTANCE = 1000;
const MAX_FILTER_DISTANCE = 500000;

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  private readonly labeledSearchLocationSubject = new ReplaySubject<LabeledSearchLocation>();
  private readonly searchLocationSubject = new ReplaySubject<SearchLocation>();
  private readonly locationMapURLSubject = new ReplaySubject<string>();
  private readonly bubbleLabelSubject = new ReplaySubject<string>();
  private readonly selectedLocationSuggestionSubject = new Subject<ItemPlace>();
  private readonly applyBtnClickSubject = new Subject();

  public readonly distanceControl: FormControl = new FormControl(MAX_FILTER_DISTANCE);
  public readonly inputFormatter = (location: LabeledSearchLocation) => location.label;

  @Input() config: LocationFilterConfig;

  constructor(private geolocationService: GeolocationService, private locationService: LocationFilterServiceService) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();

    this.onSelectSuggestion().subscribe();
    this.onSearchLocationChange().subscribe();
    this.onDistanceChange().subscribe();
    this.onApplyBtnClick().subscribe();
  }

  ngOnDestroy(): void {}

  get searchLocation$(): Observable<SearchLocation> {
    return this.searchLocationSubject.asObservable();
  }

  set searchLocation(location: SearchLocation) {
    this.searchLocationSubject.next(location);
  }

  get locationMapURL$(): Observable<string> {
    return this.locationMapURLSubject.asObservable();
  }

  set locationMapURL(url: string) {
    this.locationMapURLSubject.next(url);
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

  get bubbleLabel$(): Observable<string> {
    return this.bubbleLabelSubject.asObservable();
  }

  set bubbleLabel(label: string) {
    this.bubbleLabelSubject.next(label);
  }

  get searchDistance(): number {
    return this.distanceControl.value;
  }

  set searchDistance(distance: number) {
    this.distanceControl.setValue(distance);
  }

  get applyBtnClick$(): Observable<unknown> {
    return this.applyBtnClickSubject.asObservable();
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    const latitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude).value;
    const longitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.longitude).value;
    const distance = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.distance)?.value || MAX_FILTER_DISTANCE;

    this.searchLocation = { latitude, longitude };
    this.searchDistance = +distance / DISTANCE_FACTOR;
  }

  public handleApply(): void {
    this.applyBtnClickSubject.next();
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((location) => this.getLocationSuggestions(location))
    );

  public onSelectSuggestion(): Observable<LabeledSearchLocation> {
    return this.selectedLocationSuggestion$.pipe(
      filter((selectedLocation: ItemPlace) => !!selectedLocation),
      map((selectedLocation: ItemPlace) => selectedLocation.description),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName)),
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location)),
      tap((location: LabeledSearchLocation) => (this.locationMapURL = this.getLocationMapURL(location)))
    );
  }

  public onSearchLocationChange() {
    return this.searchLocation$.pipe(
      filter((location) => !!location),
      tap((location: SearchLocation) => (this.locationMapURL = this.getLocationMapURL(location))),
      switchMap((location: SearchLocation) =>
        this.getLocationLabelFromLatitudeAndLongitude(location).pipe(
          map((label: string) => this.mapSearchLocationToLabeledSearchLocation(location, label))
        )
      ),
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location)),
      tap((location: LabeledSearchLocation) => (this.locationMapURL = this.getLocationMapURL(location))),
      tap((location: LabeledSearchLocation) => (this.bubbleLabel = this.getBubbleLabel(location.label, this.searchDistance)))
    );
  }

  private onApplyBtnClick() {
    return this.applyBtnClick$.pipe(
      mergeMap(() => this.labeledSearchLocation$),
      tap(({ latitude, longitude }: LabeledSearchLocation) => {
        this.valueChange.emit([
          { key: this.config.mapKey.latitude, value: latitude },
          { key: this.config.mapKey.longitude, value: longitude },
          { key: this.config.mapKey.distance, value: `${this.searchDistance * DISTANCE_FACTOR}` },
        ]);
      })
    );
  }

  private onDistanceChange() {
    return this.distanceControl.valueChanges.pipe(
      distinctUntilChanged(),
      filter((distance: number) => !!distance),
      withLatestFrom(this.searchLocation$),
      tap(([distance, location]) => (this.locationMapURL = this.getLocationMapURL(location)))
    );
  }

  public selectLocationSuggestion(suggestion: ItemPlace) {
    this.selectedLocationSuggestion = suggestion;
  }

  public requestBrowserLocation() {
    this.locationService.getLocationFromBrowserAPI();
  }

  private getBubbleLabel(locationName: string, distance: number): string {
    let label = locationName;

    if (distance) {
      label = `${distance / DISTANCE_FACTOR}km · ${label}`;
    }
    return label;
  }

  private getLatitudeAndLongitudeFromLocationName(locationName: string): Observable<LabeledSearchLocation> {
    return this.geolocationService
      .geocode(locationName)
      .pipe(map((coordinate: Coordinate) => this.mapCoordinateToLabeledSearchLocation(coordinate)));
  }

  private getLocationSuggestions(locationName: string): Observable<GeolocationResponse[]> {
    return this.geolocationService.search(locationName).pipe(catchError(() => of([])));
  }

  private getLocationLabelFromLatitudeAndLongitude(location: SearchLocation): Observable<string> {
    return this.locationService.getLocationLabel(location);
  }

  private mapSearchLocationToLabeledSearchLocation(location: SearchLocation, label: string): LabeledSearchLocation {
    const { latitude, longitude } = location;

    return { latitude, longitude, label };
  }

  private mapCoordinateToLabeledSearchLocation(coordinate: Coordinate): LabeledSearchLocation {
    return {
      latitude: `${coordinate.latitude}`,
      longitude: `${coordinate.longitude}`,
      label: `${coordinate.name}`,
    };
  }

  private getLocationMapURL(location: SearchLocation | LabeledSearchLocation): string {
    const distance = this.distanceControl.value;
    const { latitude, longitude } = location;
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

    const hereMapsParams = `&z=${zoom}&${HERE_MAPS_CONFIG}&w=700&h=270&u=${distance / DISTANCE_FACTOR}k`;
    const hereMapsCoordinates = `&c=${latitude},${longitude}`;

    return HERE_MAPS_ENDPOINT + hereMapsParams + hereMapsCoordinates;
  }
}
