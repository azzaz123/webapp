import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';
import { LocationSelectComponent } from './location-select/location-select.component';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    MdIconModule,
    NgbModule.forRoot()
  ],
  exports: [
    CardModule,
    CommonModule,
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe,
    LocationSelectComponent
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
    CustomCurrencyPipe,
    LocationSelectComponent
  ],
  providers: [
    DecimalPipe
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
