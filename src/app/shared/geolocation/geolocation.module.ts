import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LocationSelectComponent } from './location-select/location-select.component';
import { GeolocationComponent } from './geolocation.component';
import { LocationModalComponent } from './location-select/location-modal/location-modal.component';
import { NgbPopoverModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { HereMapsComponent } from './here-maps/here-maps.component';
import { LocationBoxComponent } from './location-box/location-box.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgbTypeaheadModule, NgbPopoverModule, SvgIconModule],
  exports: [CommonModule, LocationSelectComponent, GeolocationComponent, LocationBoxComponent, HereMapsComponent],
  declarations: [LocationSelectComponent, LocationModalComponent, GeolocationComponent, HereMapsComponent, LocationBoxComponent],
  entryComponents: [LocationModalComponent],
})
export class GeolocationModule {}
