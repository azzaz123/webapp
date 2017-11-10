import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { GeolocationService } from '../../../core/geolocation/geolocation.service';
import { GeolocationResponse } from '../../../core/geolocation/geolocation-response.interface';

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  private MIN_LENGTH = 3;
  public focus: boolean;
  public model: any;
  @Output() public newCoordinate = new EventEmitter<Coordinate>();

  constructor(private geolocationService: GeolocationService) { }

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
    });
  }
}
