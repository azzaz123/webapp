import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationSelectComponent } from './location-select/location-select.component';
import { GeolocationComponent } from './geolocation.component';
import { LocationModalComponent } from './location-select/location-modal/location-modal.component';
import { MdIconModule } from '@angular/material';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MdIconModule,
    NgbTypeaheadModule
  ],
  exports: [
    CommonModule,
    LocationSelectComponent,
    GeolocationComponent
  ],
  declarations: [
    LocationSelectComponent,
    LocationModalComponent,
    GeolocationComponent
  ],
  entryComponents: [
    LocationModalComponent
  ]
})
export class GeolocationModule { }
