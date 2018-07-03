import { Component, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormGroup } from '@angular/forms';
import { LocationModalComponent } from './location-modal/location-modal.component';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { CookieService } from 'ngx-cookie';
import { UserService } from '../../../core/user/user.service';
import { UserLocation } from '../../../core/user/user-response.interface';

export const LOCATION_MODAL_TIMEOUT = 100;

@Component({
  selector: 'tsl-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.scss']
})
export class LocationSelectComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() name: string;
  @Input() updateLocation = true;
  @Output() locationSelected: EventEmitter<any> = new EventEmitter();
  private control: AbstractControl;
  private latitudeControl: AbstractControl;
  private longitudeControl: AbstractControl;

  constructor(private modalService: NgbModal,
              private cookieService: CookieService,
              private userService: UserService) {
  }

  ngOnChanges(changes?: any) {
    if (this.form) {
      this.control = this.form.get(this.name + '.address');
      this.latitudeControl = this.form.get(this.name + '.latitude');
      this.longitudeControl = this.form.get(this.name + '.longitude');
      if (this.control.value) {
        this.control.markAsDirty();
      }
    }
  }

  public open(element: HTMLElement) {
    setTimeout(() => {
      element.blur();
      this.control.markAsDirty();
      const modal: NgbModalRef = this.modalService.open(LocationModalComponent, {
        windowClass: 'location'
      });
      const lat: string = this.cookieService.get('searchLat');
      const lng: string = this.cookieService.get('searchLng');
      const name: string = this.cookieService.get('searchPosName');
      if (this.control.value) {
        modal.componentInstance.init({
          latitude: this.latitudeControl.value,
          longitude: this.longitudeControl.value,
          name: this.control.value
        }, this.updateLocation);
      } else if (lat && lng) {
        modal.componentInstance.init({
          latitude: lat,
          longitude: lng,
          name: name
        }, this.updateLocation);
      } else {
        modal.componentInstance.init();
      }
      modal.result.then((result: Coordinate) => {
        if (this.updateLocation) {
          this.userService.updateLocation(result).subscribe((location: UserLocation) => {
            this.control.setValue(location.title);
            this.userService.user.location = location;
            this.setLocation(result);
          });
        } else {
          this.control.setValue(result.name);
          this.setLocation(result);
        }
      }, () => {
      });
    }, LOCATION_MODAL_TIMEOUT);

  }

  setLocation(coordinates: Coordinate) {
    this.latitudeControl.setValue(coordinates.latitude);
    this.longitudeControl.setValue(coordinates.longitude);
    this.locationSelected.emit();
  }
}
