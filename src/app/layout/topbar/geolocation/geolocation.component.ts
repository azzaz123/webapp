import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { AddressResponse } from "../../../core/geolocation/address-response.interface";
import { GeolocationService } from "../../../core/geolocation/geolocation.service";
import { EventService } from "../../../core/event/event.service";
import { GeolocationResponse } from "../../../core/geolocation/geolocation-response.interface";

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

  private MIN_LENGTH = 3;
  @ViewChild('latitude') public latitude: ElementRef;
  @ViewChild('longitude') public longitude: ElementRef;

  constructor(private geolocationService: GeolocationService,
              private eventService: EventService) { }

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
    this.geolocationService.geocode(address.item.placeId).subscribe((data: AddressResponse) => {
      this.eventService.emit(EventService.UPDATE_COORDINATE, data.result.geometry.location);
    });
  }
}
