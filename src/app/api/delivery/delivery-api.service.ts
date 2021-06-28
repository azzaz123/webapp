import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SHIPPING_RULES_ENDPOINT } from './endpoints';
import { ShippingRulesResponse } from './interfaces/shipping-rules-response.interface';
import { ShippingRules } from './interfaces/shipping-rules.interface';
import { mapShippingRulesResponseToShippingRules } from './mappers/shipping-rules-mapper';

@Injectable()
export class DeliveryApiService {
  constructor(private httpClient: HttpClient) {}

  public getRules(): Observable<ShippingRules> {
    return this.httpClient.get<ShippingRulesResponse>(SHIPPING_RULES_ENDPOINT).pipe(
      map((response) => {
        return mapShippingRulesResponseToShippingRules(response);
      })
    );
  }
}
