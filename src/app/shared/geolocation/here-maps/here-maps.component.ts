import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Coordinate } from '../../../core/geolocation/address-response.interface';

export const MAP_ZOOM_GENERAL = 5;
export const MAP_ZOOM_MARKER = 15;
export const USER_MARKER = '/assets/icons/user-marker.svg';
export const USER_MARKER_SMALL = '/assets/icons/user-marker-small.svg';
export const DEFAULT_COORDINATES: Coordinate = {
  latitude: 40.42028,
  longitude: -3.70578
};

@Component({
  selector: 'tsl-here-maps',
  templateUrl: './here-maps.component.html',
  styleUrls: ['./here-maps.component.scss']
})
export class HereMapsComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() coordinates: Coordinate;
  @Input() zoom = MAP_ZOOM_GENERAL;
  @Input() size = 'normal';
  @Input() isApproximateLocation = false;
  @ViewChild('map', { static: true }) mapEl: ElementRef;
  public platform: any;
  private map: any;
  private marker: any;
  private circle: any;

  ngOnInit() {
    this.initializePlatform();
  }

  ngAfterViewInit() {
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = this.createMap(defaultLayers);
    const coordinates = this.getCenter();
    this.map.setCenter(coordinates);
    this.map.setZoom(this.zoom);
    if (+this.zoom === MAP_ZOOM_MARKER) {
      if (!this.isApproximateLocation) {
        this.addMarker(coordinates);
      } else {
        this.addCircle(coordinates);
      }
    }
  }

  ngOnChanges() {
    if (this.map) {
      const coordinates = this.getCenter();
      this.map.setCenter(coordinates);
      if (!this.isApproximateLocation) {
        this.addMarker(coordinates);
      } else {
        this.addCircle(coordinates);
      }
      this.map.setZoom(this.zoom);
    }
  }

  private addMarker(coordinates: any) {
    const icon = this.size === 'small' ? USER_MARKER_SMALL : USER_MARKER;
    const markerIcon = this.createIcon(icon);
    this.removeObjects();
    this.marker = this.createMarker(coordinates, markerIcon);
    this.map.addObject(this.marker);
  }

  private addCircle(coordinates: any) {
    this.removeObjects();
    this.circle = this.createCircle(coordinates);
    this.map.addObject(this.circle);
  }

  private removeObjects() {
    if (this.circle) {
      this.map.removeObject(this.circle);
      this.circle = null;
    }
    if (this.marker) {
      this.map.removeObject(this.marker);
      this.marker = null;
    }
  }

  private getCenter() {
    return {
      lat: this.coordinates.latitude,
      lng: this.coordinates.longitude
    };
  }

  public initializePlatform() {
    this.platform = new H.service.Platform({
      app_id: 'RgPrXX1bXt123UgUFc7B',
      app_code: 'HtfX0DsqZ2Y0x-44GfujFA',
      useCIT: false,
      useHTTPS: true
    });
  }

  public createMap(defaultLayers) {
    return new H.Map(this.mapEl.nativeElement, defaultLayers.normal.map);
  }

  public createIcon(icon: string) {
    return new H.map.Icon(icon);
  }

  public createCircle(coordinates: any) {
    return new H.map.Circle(coordinates, 650, {
      style: {
        fillColor: 'rgba(51, 51, 51, 0.15)',
        lineWidth: 0
      }
    });
  }

  public createMarker(coordinates: any, icon: H.map.Icon) {
    return new H.map.Marker(coordinates, { icon });
  }
}
