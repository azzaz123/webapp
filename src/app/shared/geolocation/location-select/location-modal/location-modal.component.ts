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

  public searchControl: FormControl;
  public latitude = 41.3968332;
  public longitude = 2.161399699999947;
  public coordinates: Coordinate;
  public zoom = 12;
  private result: any;


  constructor(public activeModal: NgbActiveModal,
              private ngZone: NgZone) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {
  }

  public setLocation(address: string, latitude: number, longitude: number) {
    this.searchControl.setValue(address);
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 16;
  }

  public onCoordinateUpdate(newCoordinate: Coordinate) {
    this.coordinates = newCoordinate;
  }

  public close() {
    if (this.coordinates) {
      this.activeModal.close({
        latitude: this.coordinates.latitude,
        longitude: this.coordinates.longitude,
        name: this.coordinates.name
      });
    } else {
      this.activeModal.dismiss();
    }
  }

}
