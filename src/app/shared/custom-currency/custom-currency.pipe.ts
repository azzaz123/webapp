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

  transform(value: any, currencyCode: string = 'EUR', digits?: string): any {
    if (!value) {
      value = 0;
    }
    if (currencyCode === 'EUR') {
      return this.decimalPipe.transform(value, digits) + ' ' + this.currencies[currencyCode];
    } else {
      return this.currencies[currencyCode] + this.decimalPipe.transform(value, digits);
    }

  }

}
