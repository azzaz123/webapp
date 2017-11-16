import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';
import { AdComponent } from './ad/ad.component';
import { CustomCurrencyPipe } from './custom-currency/custom-currency.pipe';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe
  ],
  declarations: [
    SpinnerComponent,
    AdComponent,
    CustomCurrencyPipe
  ],
  providers: [
    DecimalPipe
  ]
})
export class SharedModule { }
