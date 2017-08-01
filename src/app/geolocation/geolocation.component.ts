import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { GeolocationService } from "../core/geolocation/geolocation.service";
import { EventService } from "../core/event/event.service";

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {

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
      .switchMap(term => term.length < 3 ? [] :
        this.geolocationService.search(term)
          .catch(() => {
            return Observable.of([]);
          }));

  public formatter = (x: any) => x.description;

  public selectItem(address: any) {
    this.geolocationService.geocode(address.item.placeId).subscribe((data: any) => {
      let coordinate = data.result.geometry.location;
      this.eventService.emit(EventService.UPDATE_COORDINATE, coordinate);
    });
  }

}
