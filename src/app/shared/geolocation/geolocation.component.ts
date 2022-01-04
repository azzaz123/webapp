import { Observable, of } from 'rxjs';

import { debounceTime, switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { ItemPlace } from '../../core/geolocation/geolocation-response.interface';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../core/user/user.service';

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
})
export class GeolocationComponent implements OnInit, OnChanges {
  @Input() value: string;
  @Input() updateLocation = true;
  @Input() fromCookie = true;
  @Output() public newCoordinate = new EventEmitter<Coordinate>();
  @ViewChild('pacInputHeader', { static: true }) searchInputEl: ElementRef;
  public focus: boolean;
  public model: any = { description: '' };
  private MIN_LENGTH = 3;

  constructor(private geolocationService: GeolocationService, private cookieService: CookieService, private userService: UserService) {}

  ngOnInit() {
    const searchPosName = this.cookieService.get('searchPosName');
    if (this.fromCookie && searchPosName) {
      this.model.description = searchPosName;
    }
    this.searchInputEl.nativeElement.focus();
  }

  ngOnChanges(changes?: any) {
    if (this.value) {
      this.model.description = this.value;
    }
  }

  public search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((term) =>
        term.length < this.MIN_LENGTH
          ? []
          : this.geolocationService.search(term).pipe(
              catchError(() => {
                return of([]);
              })
            )
      )
    );

  public formatter = (x: any) => x.description;

  public selectItem(address: ItemPlace) {
    this.geolocationService.geocode(address.description).subscribe((data: Coordinate) => {
      this.newCoordinate.emit(data);

      if (this.updateLocation) {
        const newLocation: Coordinate = {
          latitude: data.latitude,
          longitude: data.longitude,
          name: address.description,
        };
        this.userService.updateSearchLocationCookies(newLocation);
      }
    });
  }
}
