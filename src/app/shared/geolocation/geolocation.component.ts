import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { GeolocationResponse } from '../../core/geolocation/geolocation-response.interface';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../core/user/user.service';
import { UserLocation } from '../../core/user/user-response.interface';

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit, OnChanges {

  private MIN_LENGTH = 3;
  public focus: boolean;
  @Output() public newCoordinate = new EventEmitter<Coordinate>();
  @Input() value: string;
  @Input() updateLocation = true;
  @Input() fromCookie = true;
  public model: any = {description: ''};
  @ViewChild('pacInputHeader') searchInputEl: ElementRef;

  constructor(
    private geolocationService: GeolocationService,
    private cookieService: CookieService,
    private userService: UserService) { }

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
    text$
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.geolocationService.search(term)
          .catch(() => {
            return Observable.of([]);
          }))

  public formatter = (x: any) => x.description;

  public selectItem(address: GeolocationResponse) {

    this.geolocationService.geocode(address.item.description).subscribe((data: Coordinate) => {
      this.newCoordinate.emit(data);

      if (this.updateLocation) {
        const newLocation: Coordinate = {
          latitude: data.latitude,
          longitude: data.longitude,
          name: address.item.description
        };
        this.userService.updateSearchLocationCookies(newLocation);
      }
    });
  }
}
