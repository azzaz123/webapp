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
  styleUrls: ['./location-select.component.scss'],
})
export class LocationSelectComponent implements OnChanges {
  @Input() form: FormGroup;
  @Input() name: string;
  @Input() updateLocation = true;
  @Input() isIncorrect = false;
  @Input() disableFocus = false;
  @Input() disableInput = false;
  @Output() locationSelected: EventEmitter<Coordinate> = new EventEmitter();
  private control: AbstractControl;
  private latitudeControl: AbstractControl;
  private longitudeControl: AbstractControl;
  private approximatedLocation: AbstractControl;

  constructor(private modalService: NgbModal, private userService: UserService) {}

  ngOnChanges(changes?: any) {
    if (this.form) {
      this.control = this.form.get(this.name + '.address');
      this.latitudeControl = this.form.get(this.name + '.latitude');
      this.longitudeControl = this.form.get(this.name + '.longitude');
      this.approximatedLocation = this.form.get(this.name + '.approximated_location');
      if (this.control.value || this.isIncorrect) {
        this.control.markAsDirty();
      }
    }
  }

  public onFocus(element: HTMLElement): void {
    if (this.disableFocus || this.disableInput) {
      return;
    }
    this.open(element);
  }

  public onClick(element: HTMLElement): void {
    if (!this.disableFocus || this.disableInput) {
      return;
    }
    this.open(element);
  }

  private open(element: HTMLElement): void {
    setTimeout(() => {
      element.blur();
      this.control.markAsDirty();
      const modal: NgbModalRef = this.modalService.open(LocationModalComponent, {
        windowClass: 'location',
      });
      if (this.control.value) {
        modal.componentInstance.init(
          {
            latitude: this.latitudeControl.value,
            longitude: this.longitudeControl.value,
            name: this.control.value,
            approximated_location: this.approximatedLocation ? this.approximatedLocation.value : null,
          },
          this.updateLocation
        );
      } else {
        modal.componentInstance.init();
      }
      modal.result.then(
        (result: Coordinate) => {
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
        },
        () => {}
      );
    }, LOCATION_MODAL_TIMEOUT);
  }

  setLocation(coordinates: Coordinate) {
    this.latitudeControl.setValue(coordinates.latitude);
    this.longitudeControl.setValue(coordinates.longitude);
    this.locationSelected.emit();
  }
}
