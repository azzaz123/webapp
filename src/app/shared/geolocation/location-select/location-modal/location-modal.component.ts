import { Component, AfterViewInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Coordinate } from '../../../../core/geolocation/address-response.interface';
import {
  DEFAULT_COORDINATES,
  MAP_ZOOM_GENERAL,
  MAP_ZOOM_MARKER,
} from '../../here-maps/here-maps.component';

@Component({
  selector: 'tsl-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss'],
})
export class LocationModalComponent implements AfterViewInit {
  public coordinates: Coordinate;
  public zoom;
  public updateLocation = true;
  public mapInitialized = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngAfterViewInit() {
    this.mapInitialized = true;
  }

  public init(coordinates?: Coordinate, updateLocation?: boolean) {
    this.coordinates = coordinates ? coordinates : DEFAULT_COORDINATES;
    this.zoom = coordinates ? MAP_ZOOM_MARKER : MAP_ZOOM_GENERAL;
    this.updateLocation = updateLocation;
  }

  public onCoordinateUpdate(newCoordinate: Coordinate) {
    this.coordinates = newCoordinate;
    this.zoom = MAP_ZOOM_MARKER;
  }

  public close() {
    if (this.coordinates) {
      this.activeModal.close(this.coordinates);
    } else {
      this.activeModal.dismiss();
    }
  }
}
