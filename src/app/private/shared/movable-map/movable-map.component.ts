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
  OnChanges,
} from '@angular/core';
import { Location, LocationWithRatio } from '@api/core/model';
import { APP_LOCALE } from '@configs/subdomains.config';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { STANDARD_ICON, SELECTED_ICON } from './constants/map-icons.constants';
import { MARKER_STATUS } from './constants/marker-status.enum';

@Component({
  selector: 'tsl-movable-map',
  templateUrl: './movable-map.component.html',
  styleUrls: ['./movable-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovableMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() centerCoordinates: Location;
  @Input() markers: Location[] = [];
  @Input() zoom: number = 8;
  @Input() ratio: number = 1;

  @Output() dragEnd: EventEmitter<LocationWithRatio> = new EventEmitter();
  @Output() markerClick: EventEmitter<Location> = new EventEmitter();
  @Output() tapMapOffMarker: EventEmitter<boolean> = new EventEmitter();
  @ViewChild('map', { static: true })
  mapEl: ElementRef;

  public readonly loading$ = this.hereMapsService.isLibraryLoading$();
  private map: H.Map;
  private group: H.map.Group;
  private standardIcon: H.map.Icon;
  private mapSubscription: Subscription = new Subscription();

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private hereMapsService: HereMapsService) {}

  ngAfterViewInit(): void {
    this.centerCoordinates = this.centerCoordinates || this.fallbackCenterCoordinates;
    this.initHereMaps();
  }

  ngOnChanges() {
    if (this.map) {
      this.map.setCenter({ lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude });
      this.map.setZoom(this.zoom);
      this.addGroupMarker(this.map);
    }
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
    this.onTapMapOutsideMarker(map);
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
    map.removeObjects(map.getObjects());
    this.group = new H.map.Group();
    this.standardIcon = new H.map.Icon(STANDARD_ICON);
    map.addObject(this.group);

    this.emitOnTapMarker();
    this.addMarkers();
  }

  private onTapMapOutsideMarker(map: H.Map): void {
    map.addEventListener('tap', (event: H.util.Event) => {
      const isNotAMarker: boolean = !event.target.hasOwnProperty('icon');

      if (isNotAMarker) {
        this.tapMapOffMarker.emit(true);
        this.group.getObjects().forEach((marker: H.map.Marker) => {
          marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
        });
      }
    });
  }

  private emitOnTapMarker(): void {
    this.group.addEventListener('tap', (evt: H.util.Event) => {
      const currentLocation: H.geo.IPoint = evt.target.b;
      this.markerClick.emit({ latitude: currentLocation.lat, longitude: currentLocation.lng });
    });
  }

  private addMarkers(): void {
    this.markers.forEach((marker: Location) => {
      const coordinate: H.geo.IPoint = { lng: marker.longitude, lat: marker.latitude };
      const standardMarker: H.map.Marker = new H.map.Marker(coordinate, { icon: this.standardIcon });
      this.setMarkerSelection(standardMarker);
      this.group.addObject(standardMarker);
    });
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

  private setMarkerSelection(marker: H.map.Marker): void {
    const selectedIcon: H.map.Icon = new H.map.Icon(SELECTED_ICON);
    marker.setData({ status: MARKER_STATUS.NON_SELECTED });

    marker.addEventListener('tap', () => {
      const markerNotSelected: boolean = marker.getData().status === MARKER_STATUS.NON_SELECTED;

      if (markerNotSelected) {
        marker.setIcon(selectedIcon), marker.setData({ status: MARKER_STATUS.SELECTED });
        this.setAllOtherMarkersToNonSelected(marker);
      } else {
        marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
      }
    });
  }

  private setAllOtherMarkersToNonSelected(currentMarker: H.map.Marker): void {
    this.group.getObjects().forEach((marker: H.map.Marker) => {
      if (marker !== currentMarker) {
        marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
      }
    });
  }

  private get fallbackCenterCoordinates(): Location {
    const fallbackLocation: LabeledSearchLocation = DEFAULT_LOCATIONS[this.locale] || DEFAULT_LOCATIONS.en;

    return {
      latitude: +fallbackLocation.latitude,
      longitude: +fallbackLocation.longitude,
    };
  }
}
