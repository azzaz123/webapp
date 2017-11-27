import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl } from '@angular/forms';
import { Coordinate } from '../../../../core/geolocation/address-response.interface';

@Component({
  selector: 'tsl-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.scss']
})
export class LocationModalComponent implements OnInit {

  public coordinates: Coordinate;
  public zoom;
  private defaultCoordinates: Coordinate = {
    latitude: 40.42028,
    longitude: -3.70578
  };

  constructor(public activeModal: NgbActiveModal) {
  }

  ngOnInit() {
  }

  public init(coordinates?: Coordinate) {
    this.coordinates = coordinates ? coordinates : this.defaultCoordinates;
    this.zoom = coordinates ? 15 : 5;
  }

  public onCoordinateUpdate(newCoordinate: Coordinate) {
    this.coordinates = newCoordinate;
    this.zoom = 15;
  }

  public close() {
    if (this.coordinates) {
      this.activeModal.close(this.coordinates);
    } else {
      this.activeModal.dismiss();
    }
  }

}
