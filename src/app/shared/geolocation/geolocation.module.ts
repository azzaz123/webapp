import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationSelectComponent } from './location-select/location-select.component';
import { GeolocationComponent } from './geolocation.component';
import { LocationModalComponent } from './location-select/location-modal/location-modal.component';
import { MdIconModule } from '@angular/material';
import { NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HereMapsComponent } from './here-maps/here-maps.component';
import { LocationBoxComponent } from './location-box/location-box.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MdIconModule,
    NgbTypeaheadModule,
    NgbPopoverModule
  ],
  exports: [
    CommonModule,
    LocationSelectComponent,
    GeolocationComponent,
    LocationBoxComponent
  ],
  declarations: [
    LocationSelectComponent,
    LocationModalComponent,
    GeolocationComponent,
    HereMapsComponent,
    LocationBoxComponent
  ],
  entryComponents: [
    LocationModalComponent
  ]
})
export class GeolocationModule { }
