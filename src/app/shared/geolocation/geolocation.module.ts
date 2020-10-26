import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationSelectComponent } from './location-select/location-select.component';
import { GeolocationComponent } from './geolocation.component';
import { LocationModalComponent } from './location-select/location-modal/location-modal.component';
import { MatIconModule } from '@angular/material';
import { NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HereMapsComponent } from './here-maps/here-maps.component';
import { LocationBoxComponent } from './location-box/location-box.component';
import { SvgIconModule } from 'app/core/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgbTypeaheadModule,
    NgbPopoverModule,
    SvgIconModule
  ],
  exports: [
    CommonModule,
    LocationSelectComponent,
    GeolocationComponent,
    LocationBoxComponent,
    HereMapsComponent
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
