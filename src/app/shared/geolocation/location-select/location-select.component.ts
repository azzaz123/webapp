import { Component, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormGroup } from '@angular/forms';
import { LocationModalComponent } from './location-modal/location-modal.component';
import { Coordinate } from '../../../core/geolocation/address-response.interface';
import { CookieService } from 'ngx-cookie';

@Component({
  selector: 'tsl-location-select',
  templateUrl: './location-select.component.html',
  styleUrls: ['./location-select.component.scss']
})
export class LocationSelectComponent implements OnChanges {

  @Input() form: FormGroup;
  @Input() name: string;
  private control: AbstractControl;
  private latitudeControl: AbstractControl;
  private longitudeControl: AbstractControl;

  constructor(private modalService: NgbModal,
              private cookieService: CookieService) {
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
        });
      } else if (lat && lng) {
        modal.componentInstance.init({
          latitude: lat,
          longitude: lng,
          name: name
        });
      } else {
        modal.componentInstance.init();
      }
      modal.result.then((result: Coordinate) => {
        if (result) {
          this.control.setValue(result.name);
          this.latitudeControl.setValue(result.latitude);
          this.longitudeControl.setValue(result.longitude);
        }
      }, () => {
      });
    }, 100);

  }

}
