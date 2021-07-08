import {Inject, Injectable, LOCALE_ID} from '@angular/core';
import {Market, MARKET_PROVIDER} from '../../../configs/market.config';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsMarketService {
  constructor(@Inject(MARKET_PROVIDER) private _market: Market, @Inject(LOCALE_ID) private _localeId: string) {
  }

  get market(): Market {
    return this._market
  }

  get localeId(): string {
    return this._localeId
  }
}
