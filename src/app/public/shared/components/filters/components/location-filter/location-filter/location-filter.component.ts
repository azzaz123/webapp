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

@Component({
  selector: 'tsl-location-filter',
  templateUrl: './location-filter.component.html',
  styleUrls: ['./location-filter.component.scss'],
})
export class LocationFilterComponent extends AbstractFilter<LocationFilterParams> implements OnInit, OnDestroy {
  private readonly labeledSearchLocationSubject = new BehaviorSubject<LabeledSearchLocation>(null);
  private readonly searchLocationSubject = new BehaviorSubject<SearchLocation>(null);
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
    console.log(this.distanceControl.value);
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
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location))
    );
  }

  public onSearchLocationChange() {
    return this.searchLocation$.pipe(
      filter((location) => !!location),
      switchMap((location: SearchLocation) =>
        this.getLocationLabelFromLatitudeAndLongitude(location).pipe(
          map((label: string) =>
            this.mapSearchLocationToLabeledSearchLocation({ latitude: location.latitude, longitude: location.longitude, label })
          )
        )
      ),
      tap((location: LabeledSearchLocation) => (this.labeledSearchLocation = location)),
      tap((location: LabeledSearchLocation) => (this.label = location.label))
    );
  }

  public onValueChange(previousValue: FilterParameter[], currentValue: FilterParameter[]): void {
    const latitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.latitude).value;
    const longitude = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.longitude).value;
    const distance = currentValue.find((param) => param.key === FILTER_QUERY_PARAM_KEY.distance).value;

    if (distance) {
      this.distanceControl.setValue(+distance / 100);
    }
    this.searchLocation = { latitude, longitude };
  }

  public selectLocationSuggestion(suggestion: ItemPlace) {
    this.selectedLocationSuggestion = suggestion;
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
}
