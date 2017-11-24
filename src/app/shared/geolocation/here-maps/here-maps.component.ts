import { Component, ElementRef, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { Coordinate } from '../../../core/geolocation/address-response.interface';

@Component({
  selector: 'tsl-here-maps',
  templateUrl: './here-maps.component.html',
  styleUrls: ['./here-maps.component.scss']
})
export class HereMapsComponent implements OnInit, OnChanges {

  @Input() coordinates: Coordinate;
  @ViewChild('map') mapEl: ElementRef;
  public platform: any;
  private map: any;
  private defaultCoordinates: any = {
    lat: 40.42028,
    lng: -3.70578
  };

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
    this.map.setZoom(5);
    this.map.setCenter(this.defaultCoordinates);
  }

  ngOnChanges() {
    if (this.coordinates) {
      const markerCoordinates = {
        lat: this.coordinates.latitude,
        lng: this.coordinates.longitude
      };
      this.map.setCenter(markerCoordinates);
      this.addMarker(markerCoordinates);
      this.map.setZoom(15);
    }
  }

  private addMarker(coordinates: any) {
    // const markerIcon = H.map.Icon('/assets/images/user-marker.png');
    // const marker = new H.map.Marker(coordinates, {icon: markerIcon});
    const marker = new H.map.Marker(coordinates);
    this.map.addObject(marker);
  }

}
