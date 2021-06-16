import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UuidService } from '@core/uuid/uuid.service';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { PaymentsCreateCreditCardApi, PaymentsUpdateCreditCardApi, PaymentsSyncCreditCardApi } from '../dtos/requests';
import { PaymentsCreditCardApi, TokenizerInformationApi } from '../dtos/responses';
import { PAYMENTS_CREDIT_CARDS_ENDPOINT, PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT } from './endpoints';

@Injectable()
export class PaymentsCreditCardHttpService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public get(): Observable<PaymentsCreditCardApi> {
    return this.http.get<PaymentsCreditCardApi>(PAYMENTS_CREDIT_CARDS_ENDPOINT);
  }

  public create(request: PaymentsCreateCreditCardApi): Observable<null> {
    return this.concatenateCreditCardRequests(request);
  }

  public update(request: PaymentsUpdateCreditCardApi): Observable<null> {
    return this.concatenateCreditCardRequests(request);
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT);
  }

  private getTokenizerInformation(): Observable<TokenizerInformationApi> {
    return this.http.get<TokenizerInformationApi>(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
  }

  private getTokenizedCard(tokenizerInfo: TokenizerInformationApi, request: PaymentsCreateCreditCardApi): Observable<string> {
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

  private concatenateCreditCardRequests(request: PaymentsCreateCreditCardApi | PaymentsUpdateCreditCardApi): Observable<null> {
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
    request: PaymentsCreateCreditCardApi | PaymentsUpdateCreditCardApi;
    tokenizedCard: string;
  }): Observable<null> {
    const body: PaymentsSyncCreditCardApi = {
      id: 'id' in data.request ? data.request.id : this.uuidService.getUUID(),
      token: data.tokenizedCard,
      registration_id: data.tokenizerInfo.id,
      holder_name: data.request.fullname,
    };

    const isUpdate = 'id' in data.request;
    if (isUpdate) {
      return this.http.put<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT, body);
    } else {
      return this.http.post<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT, body);
    }
  }
}
