import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'customCurrency'
})
export class CustomCurrencyPipe implements PipeTransform {

  private currencies: any = {
    EUR: '€',
    GBP: '£'
  };

  constructor(private decimalPipe: DecimalPipe) {
  }

  transform(value: any, currencyCode?: string, digits?: string): any {
    return this.decimalPipe.transform(value, digits) + this.currencies[currencyCode];
  }

}
