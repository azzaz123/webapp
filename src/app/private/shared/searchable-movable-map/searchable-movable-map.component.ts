import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map, catchError, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { GeolocationService } from '@core/geolocation/geolocation.service';
import { ItemPlace } from '@core/geolocation/geolocation-response.interface';

const HALF_SECOND: number = 500;

@Component({
  selector: 'tsl-searchable-movable-map',
  templateUrl: './searchable-movable-map.component.html',
  styleUrls: ['./searchable-movable-map.component.scss'],
})
export class SearchableMovableMapComponent implements OnInit {
  public readonly SEARCH_LOCATION_PLACEHOLDER = $localize`:@@map_view_all_users_all_all_searchbox_placeholder:Busca por dirección...`;
  public searchLocationForm: FormGroup;
  public searchLocation: string;
  public locationSuggestions: string[];

  constructor(private buildForm: FormBuilder, private geoLocationService: GeolocationService) {}

  ngOnInit(): void {
    this.createLocationForm();
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

  private createLocationForm(): void {
    this.searchLocationForm = this.buildForm.group({
      searchLocation: [''],
    });
    this.searchSubscription();
  }

  private searchSubscription(): void {
    this.searchLocationForm
      .get('searchLocation')
      .valueChanges.pipe(debounceTime(HALF_SECOND), distinctUntilChanged())
      .subscribe((searchQuery) => {
        this.searchLocation = searchQuery;
      });
  }

  private getLocationSuggestions(locationName: string): Observable<string[]> {
    return this.geoLocationService.search(locationName).pipe(
      map((locations: ItemPlace[]) => locations.map(({ description }) => description)),
      catchError(() => of([]))
    );
  }
}
