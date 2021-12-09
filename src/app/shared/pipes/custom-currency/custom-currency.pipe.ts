import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { CurrencyCode, currencySymbolByCode } from '@api/core/model/currency.interface';

@Pipe({
  name: 'customCurrency',
})
export class CustomCurrencyPipe implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number = 0, currencyCode: CurrencyCode = 'EUR', digits?: string): any {
    if (currencyCode === 'wallacoins') {
      return this.decimalPipe.transform(value, digits);
    }
    if (currencyCode === 'EUR' || currencyCode === 'wallacredits') {
      return this.decimalPipe.transform(value, digits) + currencySymbolByCode[currencyCode];
    }
    if (currencySymbolByCode[currencyCode]) {
      return currencySymbolByCode[currencyCode] + this.decimalPipe.transform(value, digits);
    }
    return currencyCode + this.decimalPipe.transform(value, digits);
  }
}
