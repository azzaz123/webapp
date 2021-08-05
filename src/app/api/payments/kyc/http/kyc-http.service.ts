import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';
import { KYC_ENDPOINT } from './endpoints';
import { UuidService } from '@core/uuid/uuid.service';
import { KYCBodyRequest, KYCBodyRequestedId } from '../dtos/requests';

@Injectable()
export class KYCHttpService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public request(KYCImages: KYCImages): Observable<never> {
    return this.http.post<never>(KYC_ENDPOINT, this.getFormattedBody(KYCImages), { responseType: 'text' as 'json' });
  }

  private getFormattedBody(KYCImages: KYCImages): FormData {
    const requestId: KYCBodyRequestedId = {
      id: this.uuidService.getUUID(),
    };

    const body: KYCBodyRequest = {
      firstImage: this.dataURItoBlob(KYCImages.frontSide),
      secondImage: this.dataURItoBlob(KYCImages.backSide),
      request: new Blob([JSON.stringify(requestId)], { type: 'application/json' }),
    };

    const bodyAsQueryParams: FormData = new FormData();
    Object.keys(body).forEach((key: string) => bodyAsQueryParams.append(key, body[key]));
    return bodyAsQueryParams;
  }

  // TODO: It would be good move it into a generic service in a future		Date: 2021/08/05
  private dataURItoBlob(dataURI: string): Blob {
    // Convert base64/URLEncoded data component to raw binary data
    let rawBinary: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) rawBinary = atob(dataURI.split(',')[1]);
    else rawBinary = unescape(dataURI.split(',')[1]);

    // Separate out MIMEFormData
    const mimeString: string = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // Write the bytes of the binary data to a typed array
    const blobPart: Uint8Array = new Uint8Array(rawBinary.length);
    for (let i = 0; i < rawBinary.length; i++) {
      blobPart[i] = rawBinary.charCodeAt(i);
    }

    return new Blob([blobPart], { type: mimeString });
  }
}
