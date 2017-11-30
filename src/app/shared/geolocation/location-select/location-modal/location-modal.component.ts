import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Coordinate } from '../../../../core/geolocation/address-response.interface';
import { DEFAULT_COORDINATES, MAP_ZOOM_GENERAL, MAP_ZOOM_MARKER } from '../../here-maps/here-maps.component';

@Component({
  selector: 'tsl-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent {

  public coordinates: Coordinate;
  public zoom;

  constructor(public activeModal: NgbActiveModal) {
  }

  public init(coordinates?: Coordinate) {
    this.coordinates = coordinates ? coordinates : DEFAULT_COORDINATES;
    this.zoom = coordinates ? MAP_ZOOM_MARKER : MAP_ZOOM_GENERAL;
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
