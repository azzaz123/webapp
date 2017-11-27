import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { makeAnimationEvent } from '@angular/animations/browser/src/render/shared';

@Component({
  selector: 'tsl-here-maps',
  templateUrl: './here-maps.component.html',
  styleUrls: ['./here-maps.component.scss']
})
export class HereMapsComponent implements OnInit, OnChanges {

  @Input() coordinates: Coordinate;
  @Input() zoom = 5;
  @ViewChild('map') mapEl: ElementRef;
  public platform: any;
  private map: any;


  constructor() {
    this.platform = new H.service.Platform({
      app_id: 'RgPrXX1bXt123UgUFc7B',
      app_code: 'HtfX0DsqZ2Y0x-44GfujFA',
      useCIT: true,
      useHTTPS: true
    });
  }

  ngOnInit() {
    const defaultLayers = this.platform.createDefaultLayers();
    this.map = new H.Map(this.mapEl.nativeElement, defaultLayers.normal.map);
    const coordinates = this.getCenter();
    this.map.setCenter(coordinates);
    this.map.setZoom(this.zoom);
    if (this.zoom === 15) {
      this.addMarker(coordinates);
    }
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
    const markerIcon = new H.map.Icon('/assets/icons/user-marker.svg');
    const marker = new H.map.Marker(coordinates, {icon: markerIcon});
    this.map.addObject(marker);
  }

  private getCenter() {
    return {
      lat: this.coordinates.latitude,
      lng: this.coordinates.longitude
    };
  }

}
