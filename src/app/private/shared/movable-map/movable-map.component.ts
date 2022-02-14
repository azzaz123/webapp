import {
  Component,
  ViewChild,
  Input,
  AfterViewInit,
  ElementRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  Inject,
  LOCALE_ID,
  OnDestroy,
} from '@angular/core';
import { Location, LocationWithRatio } from '@api/core/model';
import { APP_LOCALE } from '@configs/subdomains.config';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'tsl-movable-map',
  templateUrl: './movable-map.component.html',
  styleUrls: ['./movable-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovableMapComponent implements AfterViewInit, OnDestroy {
  @Input() centerCoordinates: Location;
  @Input() markers: Location[] = [];
  @Input() zoom: number = 8;
  @Input() ratio: number = 1;

  @Output() dragEnd: EventEmitter<LocationWithRatio> = new EventEmitter();
  @Output()
  markerClick: EventEmitter<Location> = new EventEmitter();
  @ViewChild('map', { static: true })
  mapEl: ElementRef;

  public readonly loading$ = this.hereMapsService.isLibraryLoading$();
  private map: H.Map;
  private mapSubscription: Subscription = new Subscription();

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private hereMapsService: HereMapsService) {}

  ngAfterViewInit(): void {
    this.centerCoordinates = this.centerCoordinates || this.fallbackCenterCoordinates;
    this.initHereMaps();
  }

  ngOnDestroy(): void {
    this.mapSubscription.unsubscribe();
  }

  private initializeMap(): H.Map {
    const defaultLayers: H.service.DefaultLayers = this.hereMapsService.platform.createDefaultLayers();
    const map: H.Map = new H.Map(this.mapEl.nativeElement, defaultLayers.vector.normal.map, {
      zoom: this.zoom,
      pixelRatio: this.ratio,
      center: { lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude },
    });
    const implementInteractions: H.mapevents.Behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const defaultUI: H.ui.UI = H.ui.UI.createDefault(map, defaultLayers);

    this.emitOnDragEnd(map);
    this.addGroupMarker(map);

    return map;
  }

  private emitOnDragEnd(map: H.Map): void {
    map.addEventListener('dragend', () => {
      const updatedLocation: H.geo.IPoint = map.getCenter();
      // TODO: Change it to radio		Date: 2022/02/14
      const updatedZoom: number = map.getZoom();

      this.dragEnd.emit({
        latitude: updatedLocation.lat,
        longitude: updatedLocation.lng,
        ratioInKm: updatedZoom,
      });
    });
  }

  private addGroupMarker(map: H.Map): void {
    const group: H.map.Group = new H.map.Group();
    map.addObject(group);

    this.emitOnTapMarker(group);

    this.markers.forEach((marker: Location) => this.addMarkerToGroup(group, { lng: marker.longitude, lat: marker.latitude }));
  }

  private emitOnTapMarker(group: H.map.Group): void {
    group.addEventListener('tap', (evt: H.util.Event) => {
      const currentLocation: H.geo.IPoint = evt.target.b;
      this.markerClick.emit({ latitude: currentLocation.lat, longitude: currentLocation.lng });
    });
  }

  private addMarkerToGroup(group: H.map.Group, coordinate: H.geo.IPoint): void {
    const marker: H.map.Marker = new H.map.Marker(coordinate);
    group.addObject(marker);
  }

  private initHereMaps(): void {
    this.mapSubscription.add(
      this.hereMapsService
        .initScript()
        .pipe(distinctUntilChanged())
        .subscribe((isReady: boolean) => {
          if (isReady) {
            this.map = this.initializeMap();
          }
        })
    );
  }

  private get fallbackCenterCoordinates(): Location {
    const fallbackLocation: LabeledSearchLocation = DEFAULT_LOCATIONS[this.locale] || DEFAULT_LOCATIONS.en;

    return {
      latitude: +fallbackLocation.latitude,
      longitude: +fallbackLocation.longitude,
    };
  }
}
