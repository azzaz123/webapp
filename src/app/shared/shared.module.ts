import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { LocationSelectComponent } from './geolocation/location-select/location-select.component';
import { LocationModalComponent } from './geolocation/location-select/location-modal/location-modal.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GeolocationComponent } from './geolocation/geolocation.component';
import { GeolocationModule } from './geolocation/geolocation.module';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    MdIconModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    GeolocationModule
  ],
  exports: [
    CardModule,
    CommonModule,
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
    CustomCurrencyPipe
  ],
  providers: [
    DecimalPipe
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
