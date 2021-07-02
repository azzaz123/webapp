import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { Toast, TOAST_TYPES } from '@layout/toast/core/interfaces/toast.interface';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { LabeledSearchLocation, SearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { GEO_APP_CODE, GEO_APP_ID } from '@shared/geolocation/here-maps/here-maps.service';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { FILTER_QUERY_PARAM_KEY } from '../../../enums/filter-query-param-key.enum';
import { FilterParameter } from '../../../interfaces/filter-parameter.interface';
import { AbstractFilter } from '../../abstract-filter/abstract-filter';
import { GeolocationNotAvailableError } from '../errors/geolocation-not-available.error';
import { LocationFilterConfig } from '../interfaces/location-filter-config.interface';
import { LocationFilterParams } from '../interfaces/location-filter-params.interface';
import { LocationFilterService } from '../services/location-filter.service';

export const LOCATION_SEARCH_BOX_DEBOUNCE = 500;

export const HERE_MAPS_ENDPOINT = 'https://image.maps.api.here.com/mia/1.6/mapview?';
export const HERE_MAPS_CONFIG = `app_id=${GEO_APP_ID}&app_code=${GEO_APP_CODE}`;

export const HERE_MAPS_PARAMS = (zoom, distance) => `&z=${zoom}&${HERE_MAPS_CONFIG}&w=700&h=270&u=${distance}k`;
export const HERE_MAPS_COORDINATES = (latitude, longitude) => `&c=${latitude},${longitude}`;

export const DISTANCE_FACTOR = 1000;
export const MAX_FILTER_DISTANCE = 500;
export const DEFAULT_ZOOM_VALUE = 13;

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  @Input() config: LocationFilterConfig;

  private subscriptions = new Subscription();
  private currentLocationForm = new FormGroup({
    location: new FormGroup({
      latitude: new FormControl(),
      longitude: new FormControl(),
    }),
    distance: new FormControl(MAX_FILTER_DISTANCE),
  });

  public componentLocationForm = new FormGroup({
    location: new FormGroup({
      latitude: new FormControl(),
      longitude: new FormControl(),
    }),
    locationName: new FormControl(),
    mapURL: new FormControl(),
    distance: new FormControl(MAX_FILTER_DISTANCE),
  });

  public bubbleActive = false;
  public loadingGeolocation = false;
  private readonly geolocationCoordinatesSubject: Subject<SearchLocation> = new Subject<SearchLocation>();
  private readonly selectedSuggestionSubject: Subject<string> = new Subject<string>();

  constructor(
    private geolocationService: GeolocationService,
    private locationService: LocationFilterService,
    private toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.onApplyLocation().subscribe((locationName: string) => {
        this.locationName = locationName;
        this.updateBubble(this.locationName, this.currentDistance);
        this.updateLocationMap(this.currentLocation, this.currentDistance);
      })
    );
    this.subscriptions.add(
      this.onDistanceChange().subscribe((distance: number) => {
        this.updateLocationMap(this.componentLocation, distance);
      })
    );
    this.subscriptions.add(
      this.onSelectLocationSuggestion().subscribe((location: SearchLocation) => {
        this.componentLocation = location;
        this.updateLocationMap(this.componentLocation, this.componentDistance);
      })
    );

    this.subscriptions.add(
      this.onGeolocationChange().subscribe((location: LabeledSearchLocation) => {
        this.componentLocation = { latitude: location.latitude, longitude: location.longitude };
        this.locationName = location.label;
        this.updateLocationMap(this.componentLocation, this.componentDistance);
      })
    );

    super.ngOnInit();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  set currentLocation(location: SearchLocation) {
    this.currentLocationForm.patchValue({ location });
  }

  get currentLocation(): SearchLocation {
    const { location } = this.currentLocationForm.value;

    return location;
  }

  set currentDistance(distance) {
    this.currentLocationForm.patchValue({ distance });
  }

  get currentDistance(): number {
    const { distance } = this.currentLocationForm.value;

    return distance;
  }

  set componentLocation(location: SearchLocation) {
    this.componentLocationForm.patchValue({ location });
  }

  get componentLocation(): SearchLocation {
    const { location } = this.componentLocationForm.value;

    return location;
  }

  get componentDistance(): number {
    const { distance } = this.componentLocationForm.value;

    return distance;
  }

  set componentDistance(distance) {
    this.componentLocationForm.patchValue({ distance });
  }

  get locationName(): string {
    const { locationName } = this.componentLocationForm.value;

    return locationName;
  }

  set locationName(locationName: string) {
    this.componentLocationForm.patchValue({ locationName });
  }

  get mapURL(): string {
    const { mapURL } = this.componentLocationForm.value;

    return mapURL;
  }

  set mapURL(mapURL: string) {
    this.componentLocationForm.patchValue({ mapURL });
  }

  get geolocationCoordinates$(): Observable<SearchLocation> {
    return this.geolocationCoordinatesSubject.asObservable();
  }

  get selectedSuggestion$(): Observable<string> {
    return this.selectedSuggestionSubject.asObservable();
  }

  public onValueChange(_: FilterParameter[], currentValue: FilterParameter[]): void {
    const latitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude).value;
    const longitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.longitude).value;
    const distance =
      currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.distance)?.value || MAX_FILTER_DISTANCE * DISTANCE_FACTOR;

    this.currentDistance = +distance / DISTANCE_FACTOR;
    this.componentDistance = +distance / DISTANCE_FACTOR;
    this.currentLocation = { latitude, longitude };
    this.componentLocation = { latitude, longitude };
    this.updateLocationMap(this.currentLocation, this.componentDistance);
  }

  public onApplyLocation(): Observable<string> {
    return this.currentLocationForm.get('location').valueChanges.pipe(
      filter((location: SearchLocation) => !!location),
      distinctUntilChanged(),
      switchMap((location: SearchLocation) => this.getLocationLabelFromLatitudeAndLongitude(location))
    );
  }

  public onDistanceChange(): Observable<number> {
    return this.componentLocationForm.get('distance').valueChanges.pipe(distinctUntilChanged());
  }

  public selectSuggestion(locationName: string) {
    this.selectedSuggestionSubject.next(locationName);
  }

  public onSelectLocationSuggestion(): Observable<LabeledSearchLocation> {
    return this.selectedSuggestion$.pipe(
      filter((locationName) => !!locationName),
      distinctUntilChanged(),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName))
    );
  }

  public onGeolocationChange(): Observable<LabeledSearchLocation> {
    return this.geolocationCoordinates$.pipe(
      switchMap((location: SearchLocation) =>
        this.getLocationLabelFromLatitudeAndLongitude(location).pipe(
          map((label: string) => {
            return {
              ...location,
              label,
            };
          })
        )
      )
    );
  }

  public handleApply(): void {
    const { latitude, longitude } = this.componentLocation;
    const label = this.locationName;
    const distance = this.componentDistance;
    const distanceValue = distance && +distance !== MAX_FILTER_DISTANCE ? `${distance * DISTANCE_FACTOR}` : null;
    const parameters: FilterParameter[] = [
      { key: this.config.mapKey.latitude, value: latitude },
      { key: this.config.mapKey.longitude, value: longitude },
      { key: this.config.mapKey.distance, value: distanceValue },
    ];

    this.locationService.setUserLocation({ latitude, longitude, label });
    this.valueChange.emit(parameters);
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(LOCATION_SEARCH_BOX_DEBOUNCE),
      distinctUntilChanged(),
      switchMap((location) => this.getLocationSuggestions(location))
    );

  public requestBrowserLocation(): void {
    this.loadingGeolocation = true;

    this.locationService
      .getLocationFromBrowserAPI()
      .then(
        (searchLocation: SearchLocation) => {
          this.geolocationCoordinatesSubject.next(searchLocation);
        },
        (error: PositionError | GeolocationNotAvailableError) => {
          const toast: Toast = {
            text: error.message,
            type: TOAST_TYPES.ERROR,
          };
          this.toastService.show(toast);
        }
      )
      .finally(() => (this.loadingGeolocation = false));
  }

  private updateLocationMap(location: SearchLocation, distance: number): void {
    const { latitude, longitude } = location;
    const zoom = this.config.mapZoomValue.find((v) => v.distance === distance).zoom || DEFAULT_ZOOM_VALUE;

    this.mapURL = `${HERE_MAPS_ENDPOINT}${HERE_MAPS_PARAMS(zoom, distance)}${HERE_MAPS_COORDINATES(latitude, longitude)}`;
  }

  private updateBubble(locationName: string, distance: number): void {
    let label = locationName;
    const distanceFilterApplied = distance && distance !== MAX_FILTER_DISTANCE;

    if (distanceFilterApplied) {
      label = `${distance}km · ${label}`;
      this.bubbleActive = true;
    } else {
      this.bubbleActive = false;
    }
    this.label = label;
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
}
