import { Component, ViewChild, Input, AfterViewInit, ElementRef, Output, EventEmitter } from '@angular/core';
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
  @Output() markerClick: EventEmitter<Location> = new EventEmitter();
  @ViewChild('map', { static: true })
  mapEl: ElementRef;

  public readonly loading$ = this.hereMapsService.isLibraryLoading$();
  private map: H.Map;

  constructor(private hereMapsService: HereMapsService) {}

  public ngAfterViewInit(): void {
    this.initHereMaps();
  }

  private initializeMap(): H.Map {
    const defaultLayers = this.hereMapsService.platform.createDefaultLayers();
    const map: H.Map = new H.Map(this.mapEl.nativeElement, defaultLayers.vector.normal.map, {
      zoom: 10,
      center: { lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude },
    });
    const implementInteractions: H.mapevents.Behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const defaultUI: H.ui.UI = H.ui.UI.createDefault(map, defaultLayers);

    this.addInfoBubble(map);

    return map;
  }

  private addInfoBubble(map: H.Map): void {
    const group: H.map.Group = new H.map.Group();
    map.addObject(group);

    group.addEventListener('tap', (evt: H.util.Event) => {
      const currentLocation: H.geo.IPoint = evt.target.b;
      this.markerClick.emit({ latitude: currentLocation.lat, longitude: currentLocation.lng });
    });

    this.addMarkerToGroup(group, { lng: -3.6833, lat: 40.4 });
    this.addMarkerToGroup(group, { lng: 2.169, lat: 41.387 });
  }

  private addMarkerToGroup(group: H.map.Group, coordinate: H.geo.IPoint): void {
    const marker: H.map.Marker = new H.map.Marker(coordinate);
    group.addObject(marker);
  }

  private initHereMaps(): void {
    this.hereMapsService
      .initScript()
      .pipe(distinctUntilChanged())
      .subscribe((isReady: boolean) => {
        if (isReady) {
          this.map = this.initializeMap();
        }
      });
  }
}
