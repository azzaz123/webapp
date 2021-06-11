import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { environment } from '@environments/environment';
import { DeliveryCreateCreditCardApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/delivery-create-credit-card-api.interface';
import { DeliveryCreditCardApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/delivery-credit-card-api.interface';
import { DeliverySyncCreditCardApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/delivery-sync-credit-card-api.interface';
import { DeliveryUpdateCreditCardApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/delivery-update-credit-card-api.interface';
import { TokenizerInformationApi } from '@private/features/delivery/interfaces/delivery-credit-card/api/tokenizer-information-api.interface';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';

export const DELIVERY_CREDIT_CARDS_ENDPOINT = `${environment.baseUrl}/api/v3/payments/cards`;
export const DELIVERY_CREDIT_CARDS_TOKENIZER_ENDPOINT = `${DELIVERY_CREDIT_CARDS_ENDPOINT}/tokenizer/information`;

@Injectable()
export class DeliveryCreditCardApiService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public get(): Observable<DeliveryCreditCardApi> {
    return this.http.get<DeliveryCreditCardApi>(DELIVERY_CREDIT_CARDS_ENDPOINT);
  }

  public create(request: DeliveryCreateCreditCardApi): Observable<null> {
    return this.concatenateCreditCardRequests(request);
  }

  public update(request: DeliveryUpdateCreditCardApi): Observable<null> {
    return this.concatenateCreditCardRequests(request);
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(DELIVERY_CREDIT_CARDS_ENDPOINT);
  }

  private getTokenizerInformation(): Observable<TokenizerInformationApi> {
    return this.http.get<TokenizerInformationApi>(DELIVERY_CREDIT_CARDS_TOKENIZER_ENDPOINT);
  }

  private getTokenizedCard(tokenizerInfo: TokenizerInformationApi, request: DeliveryCreateCreditCardApi): Observable<string> {
    const { access_key: accessKeyRef, card_registration_url: cardRegistrationURL, pre_registration_data: data } = tokenizerInfo;
    const { cardNumber, cardExpirationDate, cardCvx } = request;

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const bodyAsObject = {
      data,
      accessKeyRef,
      cardNumber,
      cardExpirationDate,
      cardCvx,
    };

    const bodyAsQueryParams = new URLSearchParams();

    Object.keys(bodyAsObject).forEach((key) => bodyAsQueryParams.append(key, bodyAsObject[key]));

    return this.http.post<string>(cardRegistrationURL, bodyAsQueryParams.toString(), { headers, responseType: 'text' as 'json' });
  }

  private concatenateCreditCardRequests(request: DeliveryCreateCreditCardApi | DeliveryUpdateCreditCardApi): Observable<null> {
    return this.getTokenizerInformation().pipe(
      concatMap((tokenizerInfo) => {
        return this.getTokenizedCard(tokenizerInfo, request).pipe(
          concatMap((tokenizedCard) => {
            return this.getCreditCardRequest({ tokenizerInfo, request, tokenizedCard });
          })
        );
      })
    );
  }

  private getCreditCardRequest(data: {
    tokenizerInfo: TokenizerInformationApi;
    request: DeliveryCreateCreditCardApi | DeliveryUpdateCreditCardApi;
    tokenizedCard: string;
  }): Observable<null> {
    const body: DeliverySyncCreditCardApi = {
      id: 'id' in data.request ? data.request.id : this.uuidService.getUUID(),
      token: data.tokenizedCard,
      registration_id: data.tokenizerInfo.id,
      holder_name: data.request.fullname,
    };

    const isUpdate = 'id' in data.request;
    if (isUpdate) {
      return this.http.put<null>(DELIVERY_CREDIT_CARDS_ENDPOINT, body);
    } else {
      return this.http.post<null>(DELIVERY_CREDIT_CARDS_ENDPOINT, body);
    }
  }
}
