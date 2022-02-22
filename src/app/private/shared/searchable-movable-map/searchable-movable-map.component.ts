import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap, filter } from 'rxjs/operators';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { Coordinate } from '@core/geolocation/address-response.interface';
import { Location } from '@api/core/model';

export const HALF_SECOND: number = 500;

@Component({
  selector: 'tsl-searchable-movable-map',
  templateUrl: './searchable-movable-map.component.html',
  styleUrls: ['./searchable-movable-map.component.scss'],
})
export class SearchableMovableMapComponent implements OnInit, OnDestroy {
  @Output() selectedLocationCoordinates: EventEmitter<Location> = new EventEmitter();

  public readonly SEARCH_LOCATION_PLACEHOLDER = $localize`:@@collection_point_map_all_users_all_all_searchbox_placeholder:Busca por dirección...`;
  public searchLocationForm: FormGroup;
  public searchLocation: string;
  public locationSuggestions: string[];
  private readonly selectedSuggestionSubject: Subject<string> = new Subject<string>();
  private subscriptions = new Subscription();

  constructor(private buildForm: FormBuilder, private geoLocationService: GeolocationService) {}

  ngOnInit(): void {
    this.buildSearchLocationForm();
    this.subscriptions.add(
      this.onSelectLocationSuggestion().subscribe((location: LabeledSearchLocation) => {
        this.searchLocationForm.setValue({ searchLocation: location.label });
        this.selectedLocationCoordinates.emit({
          latitude: +location.latitude,
          longitude: +location.longitude,
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get selectedSuggestion$(): Observable<string> {
    return this.selectedSuggestionSubject.asObservable();
  }

  public resetSearchQuery(): void {
    this.searchLocationForm.controls.searchLocation.reset();
  }

  public search = (text$: Observable<string>): Observable<string[]> =>
    text$.pipe(
      debounceTime(HALF_SECOND),
      distinctUntilChanged(),
      switchMap((searchLocation) => this.getLocationSuggestions(searchLocation))
    );

  public onSelectLocationSuggestion(): Observable<LabeledSearchLocation> {
    return this.selectedSuggestion$.pipe(
      filter((locationName) => !!locationName),
      distinctUntilChanged(),
      switchMap((locationName: string) => this.getLatitudeAndLongitudeFromLocationName(locationName))
    );
  }

  public selectSuggestion(locationName: string): void {
    this.selectedSuggestionSubject.next(locationName);
  }

  private buildSearchLocationForm(): void {
    this.searchLocationForm = this.buildForm.group({
      searchLocation: [],
    });
  }

  private getLocationSuggestions(locationName: string): Observable<string[]> {
    return this.geoLocationService.search(locationName).pipe(
      map((locations: ItemPlace[]) => locations.map(({ description }) => this.reverseDescriptionWithCountryAtTheEnd(description))),
      catchError(() => of([]))
    );
  }

  private reverseDescriptionWithCountryAtTheEnd(description: string): string {
    return description.split(',').reverse().join();
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
}
