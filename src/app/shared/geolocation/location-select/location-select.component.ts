import { Component, Input, OnChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AbstractControl, FormGroup } from '@angular/forms';
import { LocationModalComponent } from './location-modal/location-modal.component';

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

  constructor(private modalService: NgbModal) {
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
        backdrop: 'static',
        keyboard: false,
        size: 'lg'
      });
      if (this.control.value) {
        modal.componentInstance.setLocation(this.control.value, this.latitudeControl.value, this.longitudeControl.value);
      }
      modal.result.then((result: any) => {
        if (result && result.formatted_address && result.geometry) {
          this.control.setValue(result.formatted_address);
          this.latitudeControl.setValue(result.geometry.location.lat());
          this.longitudeControl.setValue(result.geometry.location.lng());
        }
      }, () => {
      });
    }, 100);

  }

}
