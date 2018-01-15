import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { ReactiveFormsModule } from '@angular/forms';
import { GeolocationModule } from './geolocation/geolocation.module';
import { RestrictInputDirective } from './restrict-input/restrict-input.directive';

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
    CustomCurrencyPipe,
    RestrictInputDirective
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
    CustomCurrencyPipe,
    RestrictInputDirective
  ],
  providers: [
    DecimalPipe
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
