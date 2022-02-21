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
import {
  STANDARD_ICON,
  SELECTED_ICON,
  METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL,
  HALF_CIRCUMFERENCE_DEGREES,
  DEFAULT_VALUE_ZOOM,
} from './constants/map.constants';
import { MARKER_STATUS } from './constants/marker-status.enum';

@Component({
  selector: 'tsl-movable-map',
  templateUrl: './movable-map.component.html',
  styleUrls: ['./movable-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovableMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() centerCoordinates: Location = this.fallbackCenterCoordinates;
  @Input() markers: Location[] = [];
  @Input() zoom: number = DEFAULT_VALUE_ZOOM;

  @Output() mapViewChangeEnd: EventEmitter<LocationWithRatio> = new EventEmitter();
  @Output() markerClick: EventEmitter<Location> = new EventEmitter();
  @Output() tapMapOffMarker: EventEmitter<void> = new EventEmitter();
  @ViewChild('map', { static: true })
  mapEl: ElementRef;

  public readonly loading$ = this.hereMapsService.isLibraryLoading$();
  private map: H.Map;
  private group: H.map.Group;
  private standardIcon: H.map.Icon;
  private mapSubscription: Subscription = new Subscription();

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private hereMapsService: HereMapsService) {}

  ngAfterViewInit(): void {
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
      center: { lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude },
    });
    const implementInteractions: H.mapevents.Behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const defaultUI: H.ui.UI = H.ui.UI.createDefault(map, defaultLayers);

    this.emitLocationAndRadius(map);
    this.addGroupMarker(map);
    this.onTapMapOutsideMarker(map);
    return map;
  }

  private emitLocationAndRadius(map: H.Map): void {
    map.addEventListener('mapviewchangeend', () => {
      const updatedLocation: H.geo.IPoint = map.getCenter();
      const updatedZoom: number = map.getZoom();
      this.mapViewChangeEnd.emit({
        latitude: updatedLocation.lat,
        longitude: updatedLocation.lng,
        ratioInKm: this.getRadiusInKm(updatedZoom, updatedLocation.lat),
      });
    });
  }

  private addGroupMarker(map: H.Map): void {
    map.removeObjects(map.getObjects());
    this.group = new H.map.Group();
    this.standardIcon = new H.map.Icon(STANDARD_ICON);
    map.addObject(this.group);

    this.addMarkers();
  }

  private onTapMapOutsideMarker(map: H.Map): void {
    map.addEventListener('tap', (event: H.util.Event) => {
      const isNotAMarker: boolean = !(event.target instanceof H.map.Marker);

      if (isNotAMarker) {
        this.tapMapOffMarker.emit();
        this.group.getObjects().forEach((marker: H.map.Marker) => {
          marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
        });
      }
    });
  }

  private getRadiusInKm(zoom: number, latitude: number): number {
    return Math.round(
      (METERS_PER_MAP_TILE_AT_THE_SMALLEST_ZOOM_LEVEL * Math.cos((latitude * Math.PI) / HALF_CIRCUMFERENCE_DEGREES)) / Math.pow(2, zoom)
    );
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
            window.addEventListener('resize', () => this.map.getViewPort().resize());
          }
        })
    );
  }

  private setMarkerSelection(marker: H.map.Marker): void {
    const selectedIcon: H.map.Icon = new H.map.Icon(SELECTED_ICON);
    marker.setData({ status: MARKER_STATUS.NON_SELECTED });

    marker.addEventListener('tap', (event: H.util.Event) => {
      this.emitLocationOnTapMarker(event);
      const markerNotSelected: boolean = marker.getData().status === MARKER_STATUS.NON_SELECTED;

      if (markerNotSelected) {
        marker.setIcon(selectedIcon), marker.setData({ status: MARKER_STATUS.SELECTED });
        this.setAllOtherMarkersToNonSelected(marker);
      } else {
        marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
      }
    });
  }

  private emitLocationOnTapMarker(event: H.util.Event): void {
    const currentLocation: H.geo.IPoint = event.target.b;
    this.markerClick.emit({ latitude: currentLocation.lat, longitude: currentLocation.lng });
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
