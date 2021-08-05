import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { Observable } from 'rxjs';
import { KYC_ENDPOINT } from './endpoints';
import { UuidService } from '@core/uuid/uuid.service';

@Injectable()
export class KYCHttpService {
  constructor(private http: HttpClient, private uuidService: UuidService) {}

  public request(KYCImages: KYCImages): Observable<never> {
    const bodyRequest = {
      id: this.uuidService.getUUID(),
    };

    const body = {
      firstImage: this.dataURItoBlob(KYCImages.frontSide),
      secondImage: this.dataURItoBlob(KYCImages.backSide),
      request: new Blob([JSON.stringify(bodyRequest)], { type: 'application/json' }),
    };

    const bodyAsQueryParams = new FormData();
    Object.keys(body).forEach((key: string) => bodyAsQueryParams.append(key, body[key]));

    return this.http.post<never>(KYC_ENDPOINT, bodyAsQueryParams, { responseType: 'text' as 'json' });
  }

  private dataURItoBlob(dataURI: string): Blob {
    let byteString: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) byteString = atob(dataURI.split(',')[1]);
    else byteString = unescape(dataURI.split(',')[1]);

    const mimeString: string = dataURI.split(',')[0].split(':')[1].split(';')[0];

    const blobPart: Uint8Array = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      blobPart[i] = byteString.charCodeAt(i);
    }

    return new Blob([blobPart], { type: mimeString });
  }
}
