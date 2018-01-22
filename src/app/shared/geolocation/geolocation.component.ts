import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Coordinate } from '../../core/geolocation/address-response.interface';
import { GeolocationService } from '../../core/geolocation/geolocation.service';
import { GeolocationResponse } from '../../core/geolocation/geolocation-response.interface';
import { CookieService } from 'ngx-cookie';

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
  public model: any = {description: ''};

  constructor(private geolocationService: GeolocationService, private cookieService: CookieService) { }

  ngOnInit() {
    const searchPosName = this.cookieService.get('searchPosName');
    if (searchPosName) {
      this.model.description = searchPosName;
    }
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
          }));

  public formatter = (x: any) => x.description;

  public selectItem(address: GeolocationResponse) {

    this.geolocationService.geocode(address.item.description).subscribe((data: Coordinate) => {
      this.newCoordinate.emit(data);

      const expirationDate = new Date();
      expirationDate.setTime(expirationDate.getTime() + (15 * 60 * 1000));
      const cookieOptions = {expires: expirationDate, domain: '.wallapop.com'};

      this.cookieService.put('searchLat', data.latitude.toString(), cookieOptions);
      this.cookieService.put('searchLng', data.longitude.toString(), cookieOptions);
      this.cookieService.put('searchPosName', address.item.description, cookieOptions);
    });
  }
}
