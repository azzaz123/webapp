import { DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { CustomCurrencyPipe } from './custom-currency.pipe';

@NgModule({
  providers: [DecimalPipe],
  declarations: [CustomCurrencyPipe],
  exports: [CustomCurrencyPipe],
})
export class CustomCurrencyModule {}
