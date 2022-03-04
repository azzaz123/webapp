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
  SimpleChanges,
} from '@angular/core';
import { Location, LocationWithRadius } from '@api/core/model';
import { APP_LOCALE } from '@configs/subdomains.config';
import { DEFAULT_LOCATIONS } from '@public/features/search/core/services/constants/default-locations';
import { LabeledSearchLocation } from '@public/features/search/core/services/interfaces/search-location.interface';
import { HereMapsService } from '@shared/geolocation/here-maps/here-maps.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { STANDARD_ICON, SELECTED_ICON, DEFAULT_VALUE_ZOOM, getRadiusInKm } from './constants/map.constants';
import { MARKER_STATUS } from './constants/marker-status.enum';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'tsl-movable-map',
  templateUrl: './movable-map.component.html',
  styleUrls: ['./movable-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovableMapComponent implements AfterViewInit, OnDestroy, OnChanges {
  @Input() centerCoordinates: Location;
  @Input() markers: Location[] = [];

  @Output() mapViewChangeEnd: EventEmitter<LocationWithRadius> = new EventEmitter();
  @Output() tapMarker: EventEmitter<Location> = new EventEmitter();
  @Output() tapMap: EventEmitter<void> = new EventEmitter();
  @ViewChild('map', { static: true })
  mapEl: ElementRef;

  public readonly loading$ = this.hereMapsService.isLibraryLoading$();
  private map: H.Map;
  private group: H.map.Group;
  private standardIcon: H.map.Icon;
  private selectedIcon: H.map.Icon;
  private mapSubscription: Subscription = new Subscription();
  private lastSelectedMarker: H.map.Marker;

  constructor(@Inject(LOCALE_ID) private locale: APP_LOCALE, private hereMapsService: HereMapsService) {}

  ngAfterViewInit(): void {
    this.centerCoordinates = this.centerCoordinates || this.fallbackCenterCoordinates;
    this.initHereMaps();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.markers?.currentValue && !changes.centerCoordinates?.currentValue) {
      return;
    }
    if (changes.markers?.isFirstChange() || changes.centerCoordinates?.isFirstChange()) {
      return;
    }
    if (changes.markers) {
      const previousMarkers = changes.markers.previousValue;
      const currentMarkers = changes.markers.currentValue;
      if (!isEqual(previousMarkers, currentMarkers)) {
        const markers: H.map.Marker[] = this.getMarkersByLocation(currentMarkers);
        this.group.removeObjects(this.group.getObjects());
        this.addMarkers(markers);
        this.addSelectedMarker();
      }
    }

    if (changes.centerCoordinates) {
      const previousCoordinates = changes.centerCoordinates.previousValue;
      const currentCoordinates = changes.centerCoordinates.currentValue;
      if (!isEqual(previousCoordinates, currentCoordinates)) {
        this.setMapCenter(currentCoordinates);
      }
    }
  }

  ngOnDestroy(): void {
    this.mapSubscription.unsubscribe();
  }

  private initHereMaps(): void {
    this.mapSubscription.add(
      this.hereMapsService
        .initScript()
        .pipe(distinctUntilChanged())
        .subscribe((isReady: boolean) => {
          if (isReady) {
            this.map = this.mapReference;
            this.setGroupAndIconsOnTheMap();
            this.setMarkersOnTheMap();
            this.listenToMapViewChangeEnd();
            this.listenToMarkerSelection();
            window.addEventListener('resize', () => this.map.getViewPort().resize());
          }
        })
    );
  }

  private get mapReference(): H.Map {
    const defaultLayers: H.service.DefaultLayers = this.hereMapsService.platform.createDefaultLayers();
    const map: H.Map = new H.Map(this.mapEl.nativeElement, defaultLayers.vector.normal.map, {
      zoom: DEFAULT_VALUE_ZOOM,
      center: { lat: this.centerCoordinates.latitude, lng: this.centerCoordinates.longitude },
    });
    const implementInteractions: H.mapevents.Behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    const defaultUI: H.ui.UI = H.ui.UI.createDefault(map, defaultLayers);

    return map;
  }

  private setGroupAndIconsOnTheMap(): void {
    this.group = new H.map.Group();
    this.standardIcon = new H.map.Icon(STANDARD_ICON);
    this.selectedIcon = new H.map.Icon(SELECTED_ICON);
    this.map.addObject(this.group);
  }

  private setMarkersOnTheMap(): void {
    const markers = this.getMarkersByLocation(this.markers);
    this.addMarkers(markers);
  }

  private listenToMapViewChangeEnd(): void {
    this.map.addEventListener('mapviewchangeend', () => {
      const updatedLocation: H.geo.IPoint = this.map.getCenter();
      const updatedZoom: number = this.map.getZoom();
      this.mapViewChangeEnd.emit({
        latitude: updatedLocation.lat,
        longitude: updatedLocation.lng,
        radiusInKm: getRadiusInKm(updatedZoom, updatedLocation.lat),
      });
    });
  }

  private listenToMarkerSelection(): void {
    this.map.addEventListener('tap', (event: H.util.Event) => {
      if (event.target instanceof H.map.Marker) {
        const marker = event.target;
        const markerIsNotSelected: boolean = marker.getData().status === MARKER_STATUS.NON_SELECTED;

        if (markerIsNotSelected) {
          this.setMarkerToSelected(marker);
          this.setLastSelectedMarker(marker);
          this.emitLocationOnTapMarker(event);
        } else {
          this.unselectMarker(marker);
          this.lastSelectedMarker = null;
        }
      } else {
        this.unselectMarker(this.lastSelectedMarker);
      }
    });
  }

  private setMapCenter(coordinates: Location): void {
    if (this.map) {
      this.map.setCenter({ lng: coordinates.longitude, lat: coordinates.latitude });
      this.map.setZoom(DEFAULT_VALUE_ZOOM);
    }
  }

  private getMarkersByLocation(locations: Location[]): H.map.Marker[] {
    return locations.map((location: Location) => {
      const coordinate: H.geo.IPoint = { lng: location.longitude, lat: location.latitude };
      const standardMarker: H.map.Marker = new H.map.Marker(coordinate, { icon: this.standardIcon });

      standardMarker.setData({ status: MARKER_STATUS.NON_SELECTED });
      return standardMarker;
    });
  }

  private addMarkers(markers: H.map.Marker[]): void {
    this.group.addObjects(markers);
  }

  private addSelectedMarker(): void {
    if (this.lastSelectedMarker) {
      this.group.addObject(this.lastSelectedMarker.setData({ status: MARKER_STATUS.SELECTED }));
    }
  }

  private unselectMarker(marker: H.map.Marker): void {
    this.setMarkerToNonSelected(marker);
    this.tapMap.emit();
  }

  private setMarkerToNonSelected(marker: H.map.Marker): void {
    marker.setIcon(this.standardIcon), marker.setData({ status: MARKER_STATUS.NON_SELECTED });
  }

  private setMarkerToSelected(marker: H.map.Marker): void {
    marker.setIcon(this.selectedIcon), marker.setData({ status: MARKER_STATUS.SELECTED });
  }

  private setLastSelectedMarker(marker: H.map.Marker): void {
    if (this.lastSelectedMarker) {
      this.setMarkerToNonSelected(this.lastSelectedMarker);
    }
    this.lastSelectedMarker = marker;
  }

  private emitLocationOnTapMarker(event: H.util.Event): void {
    const currentLocation: H.geo.IPoint = event.target.b;
    const locationCoordinates: Location = { latitude: currentLocation.lat, longitude: currentLocation.lng };
    this.tapMarker.emit(locationCoordinates);
  }

  private get fallbackCenterCoordinates(): Location {
    const fallbackLocation: LabeledSearchLocation = DEFAULT_LOCATIONS[this.locale] || DEFAULT_LOCATIONS.en;

    return {
      latitude: +fallbackLocation.latitude,
      longitude: +fallbackLocation.longitude,
    };
  }
}
