import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { makeAnimationEvent } from '@angular/animations/browser/src/render/shared';

export const MAP_ZOOM_GENERAL = 5;
export const MAP_ZOOM_MARKER = 15;
export const USER_MARKER = '/assets/icons/user-marker.svg';
export const DEFAULT_COORDINATES: Coordinate = {
  latitude: 40.42028,
  longitude: -3.70578
};

@Component({
  selector: 'tsl-here-maps',
  templateUrl: './here-maps.component.html',
  styleUrls: ['./here-maps.component.scss']
})
export class HereMapsComponent implements OnInit, OnChanges {

  @Input() coordinates: Coordinate;
  @Input() zoom = MAP_ZOOM_GENERAL;
  @Input() size = 'normal';
  @ViewChild('map') mapEl: ElementRef;
  public platform: any;
  private map: any;
  private marker: any;


  constructor() {
    this.platform = new H.service.Platform({
      app_id: 'RgPrXX1bXt123UgUFc7B',
      app_code: 'HtfX0DsqZ2Y0x-44GfujFA',
      useCIT: true,
      useHTTPS: true
    });
  }

  ngOnInit() {
    setTimeout(() => {
      const defaultLayers = this.platform.createDefaultLayers();
      this.map = new H.Map(this.mapEl.nativeElement, defaultLayers.normal.map);
      const coordinates = this.getCenter();
      this.map.setCenter(coordinates);
      this.map.setZoom(this.zoom);
      if (+this.zoom === MAP_ZOOM_MARKER) {
        this.addMarker(coordinates);
      }
    });
  }

  ngOnChanges() {
    if (this.map) {
      const coordinates = this.getCenter();
      this.map.setCenter(coordinates);
      this.addMarker(coordinates);
      this.map.setZoom(this.zoom);
    }
  }

  private addMarker(coordinates: any) {
    const markerIcon = new H.map.Icon(USER_MARKER);
    if (this.marker) {
      this.map.removeObject(this.marker);
    }
    this.marker = new H.map.Marker(coordinates, {icon: markerIcon});
    this.map.addObject(this.marker);
  }

  private getCenter() {
    return {
      lat: this.coordinates.latitude,
      lng: this.coordinates.longitude
    };
  }

}
