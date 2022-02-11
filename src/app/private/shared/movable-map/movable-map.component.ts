import { Component, ElementRef, ViewChild, AfterViewInit, Input } from '@angular/core';
import { Location } from '@api/core/model';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { distinctUntilChanged } from 'rxjs/operators';
@Component({
  selector: 'tsl-movable-map',
  templateUrl: './movable-map.component.html',
  styleUrls: ['./movable-map.component.scss'],
})
export class MovableMapComponent implements AfterViewInit {
  @Input() centerCoordinates: Location = { latitude: 40.42028, longitude: -3.70578 };
  @Input() markers: Location[];

  @ViewChild('map', { static: true })
  mapEl: ElementRef;
  public readonly loading$ = this.hereMapsService.isLibraryLoading$();

  constructor(private hereMapsService: HereMapsService) {}

  public ngAfterViewInit(): void {
    this.initHereMaps();
  }

  private initializeMap(): void {
    const defaultLayers = this.hereMapsService.platform.createDefaultLayers();
    const map: H.Map = new H.Map(this.mapEl.nativeElement, defaultLayers.vector.normal.map, {
      zoom: 10,
      center: { lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude },
    });
  }

  private initHereMaps(): void {
    this.hereMapsService
      .initScript()
      .pipe(distinctUntilChanged())
      .subscribe((isReady: boolean) => {
        if (isReady) {
          this.initializeMap();
        }
      });
  }
}
