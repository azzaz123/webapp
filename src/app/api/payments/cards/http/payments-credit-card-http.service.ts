import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CreditCardSyncRequest } from '@api/core/model/cards/credit-card-sync-request.interface';
import { UuidService } from '@core/uuid/uuid.service';
import { Observable } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { PaymentsSyncCreditCardApi } from '../dtos/requests';
import { PaymentsCreditCardApi, TokenizerInformationApi } from '../dtos/responses';
import { PAYMENTS_CREDIT_CARDS_ENDPOINT, PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT } from './endpoints';

interface TokenizeCardRegistrationRequest {
  request: CreditCardSyncRequest;
  tokenizerInfo: TokenizerInformationApi;
}

interface PreSyncCreditCardData extends TokenizeCardRegistrationRequest {
  tokenizedCard: string;
}

@Injectable()
export class PaymentsCreditCardHttpService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public get(): Observable<PaymentsCreditCardApi> {
    return this.http.get<PaymentsCreditCardApi>(PAYMENTS_CREDIT_CARDS_ENDPOINT);
  }

  public create(request: CreditCardSyncRequest): Observable<null> {
    return this.concatenateCreditCardRequests(request, false);
  }

  public update(request: CreditCardSyncRequest): Observable<null> {
    return this.concatenateCreditCardRequests(request, true);
  }

  public delete(): Observable<null> {
    return this.http.delete<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT);
  }

  private getTokenizerInformation(): Observable<TokenizerInformationApi> {
    return this.http.get<TokenizerInformationApi>(PAYMENTS_CREDIT_CARDS_TOKENIZER_ENDPOINT);
  }

  private postToUrlAsFormUrlEncoded(url: string, body: string): Observable<string> {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    return this.http.post<string>(url, body, { headers, responseType: 'text' as 'json' });
  }

  private createCardInServer(body: PaymentsSyncCreditCardApi): Observable<null> {
    return this.http.post<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT, body);
  }

  private updateCardInServer(body: PaymentsSyncCreditCardApi): Observable<null> {
    return this.http.put<null>(PAYMENTS_CREDIT_CARDS_ENDPOINT, body);
  }

  private getTokenizedCard(tokenizeRequest: TokenizeCardRegistrationRequest): Observable<string> {
    const { card_registration_url: url } = tokenizeRequest.tokenizerInfo;
    const body = this.generateCardRegistrationBody(tokenizeRequest);

    return this.postToUrlAsFormUrlEncoded(url, body);
  }

  private generateCardRegistrationBody(tokenizeRequest: TokenizeCardRegistrationRequest): string {
    const { access_key: accessKeyRef, pre_registration_data: data } = tokenizeRequest.tokenizerInfo;
    const { cardNumber, cardExpirationDate, cardCvx } = tokenizeRequest.request;

    const bodyAsObject = {
      data,
      accessKeyRef,
      cardNumber,
      cardExpirationDate,
      cardCvx,
    };

    const bodyAsQueryParams = new URLSearchParams();
    Object.keys(bodyAsObject).forEach((key) => bodyAsQueryParams.append(key, bodyAsObject[key]));

    return bodyAsQueryParams.toString();
  }

  private generateSyncCreditCardBody(data: PreSyncCreditCardData, isUpdate: boolean): PaymentsSyncCreditCardApi {
    const body: PaymentsSyncCreditCardApi = {
      id: isUpdate ? data.request.id : this.uuidService.getUUID(),
      token: data.tokenizedCard,
      registration_id: data.tokenizerInfo.id,
      holder_name: data.request.fullname,
    };

    return body;
  }

  private getCreditCardRequest(data: PreSyncCreditCardData, isUpdate: boolean): Observable<null> {
    const body = this.generateSyncCreditCardBody(data, isUpdate);
    return isUpdate ? this.updateCardInServer(body) : this.createCardInServer(body);
  }

  private concatenateCreditCardRequests(request: CreditCardSyncRequest, isUpdate: boolean): Observable<null> {
    return this.getTokenizerInformation().pipe(
      concatMap((tokenizerInfo) => {
        return this.getTokenizedCard({ tokenizerInfo, request }).pipe(
          concatMap((tokenizedCard) => {
            return this.getCreditCardRequest({ tokenizerInfo, request, tokenizedCard }, isUpdate);
          })
        );
      })
    );
  }
}
