import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Location } from '@api/core/model';
import { LocationWithRadius } from '@api/core/model/location/location';

export const HALF_SECOND_IN_MS: number = 500;

@Component({
  selector: 'tsl-searchable-movable-map',
  templateUrl: './searchable-movable-map.component.html',
  styleUrls: ['./searchable-movable-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchableMovableMapComponent implements OnInit, OnDestroy {
  @Input() mapCenterCoordinates: Location;
  @Input() mapMarkers: Location[] = [];

  @Output() mapViewChangeEnd: EventEmitter<LocationWithRadius> = new EventEmitter();
  @Output() tapMarker: EventEmitter<Location> = new EventEmitter();
  @Output() tapMap: EventEmitter<void> = new EventEmitter();

  public searchLocationForm: FormGroup;
  public locationSuggestions: string[];
  private readonly selectedSuggestionSubject: Subject<string> = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(
    private buildForm: FormBuilder,
    private geoLocationService: GeolocationService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.buildSearchLocationForm();
    this.handleSelectLocationSuggestion();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public resetSearchQuery(): void {
    this.searchLocationForm.controls.searchLocation.reset();
  }

  public search = (text$: Observable<string>): Observable<string[]> =>
    text$.pipe(
      debounceTime(HALF_SECOND_IN_MS),
      distinctUntilChanged(),
      switchMap((searchLocation) => this.getLocationSuggestions(searchLocation))
    );

  public onSelectLocationSuggestion(): Observable<LabeledSearchLocation> {
    return this.selectedSuggestion$.pipe(
      filter((locationName) => !!locationName),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName))
    );
  }

  public selectSuggestion(locationName: string): void {
    this.selectedSuggestionSubject.next(locationName);
  }

  public onTapMap(): void {
    this.tapMap.emit();
  }

  public onTapMarker(tappedMarker: Location): void {
    this.tapMarker.emit(tappedMarker);
  }

  public onMapViewChangeEnd(centerCoordinatesWithRadius: LocationWithRadius): void {
    this.mapViewChangeEnd.emit(centerCoordinatesWithRadius);
  }

  private buildSearchLocationForm(): void {
    this.searchLocationForm = this.buildForm.group({
      searchLocation: [],
    });
  }

  private handleSelectLocationSuggestion(): void {
    this.subscriptions.add(
      this.onSelectLocationSuggestion().subscribe((location: LabeledSearchLocation) => {
        this.searchLocationForm.setValue({ searchLocation: location.label });
        this.mapCenterCoordinates = {
          latitude: +location.latitude,
          longitude: +location.longitude,
        };
        this.changeDetectorRef.detectChanges();
      })
    );
  }

  private getLocationSuggestions(locationName: string): Observable<string[]> {
    return this.geoLocationService.search(locationName).pipe(
      map((locations: ItemPlace[]) => locations.map(({ description }) => this.reverseDescriptionWithCountryAtTheEnd(description))),
      catchError(() => of([]))
    );
  }

  private reverseDescriptionWithCountryAtTheEnd(description: string): string {
    return description.split(',').reverse().join(', ');
  }

  private getLatitudeAndLongitudeFromLocationName(locationName: string): Observable<LabeledSearchLocation> {
    return this.geoLocationService
      .geocode(locationName)
      .pipe(map((coordinate: Coordinate) => this.mapCoordinateToLabeledSearchLocation(coordinate)));
  }

  private mapCoordinateToLabeledSearchLocation(coordinate: Coordinate): LabeledSearchLocation {
    return {
      latitude: `${coordinate.latitude}`,
      longitude: `${coordinate.longitude}`,
      label: `${coordinate.name}`,
    };
  }

  private get selectedSuggestion$(): Observable<string> {
    return this.selectedSuggestionSubject.asObservable();
  }
}
