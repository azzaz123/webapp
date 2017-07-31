import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { distinctUntilChanged } from 'rxjs/operator/distinctUntilChanged';
import { map } from 'rxjs/operator/map';
import { Observable } from "rxjs/Observable";
import { GeolocationService } from "../core/geolocation/geolocation.service";

@Component({
  selector: 'tsl-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {
  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(private geolocationService: GeolocationService) { }

  ngOnInit() {
  }

  public search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
        this.geolocationService.search(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

  public selectedItem(item){
    console.log(item);
    this.geolocationService.geocode(item).subscribe((data: any) => {
      console.log(data);
    });
  }

}
