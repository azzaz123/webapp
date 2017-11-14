import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { GeolocationService } from '../../../core/geolocation/geolocation.service';
import { GeolocationResponse } from '../../../core/geolocation/geolocation-response.interface';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  private MIN_LENGTH = 3;
  public focus: boolean;
  public model: any;
  public expirationDate: any;
  @Output() public newCoordinate = new EventEmitter<Coordinate>();

  constructor(private geolocationService: GeolocationService, private cookieService: CookieService) { }

  ngOnInit() {
  }

  public search = (text$: Observable<string>) =>
    text$
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.geolocationService.search(term)
          .catch(() => {
            return Observable.of([]);
          }));

  public formatter = (x: any) => x.description;

  public selectItem(address: GeolocationResponse) {
    this.geolocationService.geocode(address.item.description).subscribe((data: Coordinate) => {
      this.newCoordinate.emit(data);
      this.expirationDate = new Date();
      this.expirationDate.setTime(this.expirationDate.getTime() + (15 * 60 * 1000));
      this.cookieService.put('searchLat', data.latitude.toString(), {expires: this.expirationDate, domain: '.wallapop.com'});
      this.cookieService.put('searchLng', data.longitude.toString(), {expires: this.expirationDate, domain: '.wallapop.com'});
    });
  }
}
