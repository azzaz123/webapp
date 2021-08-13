import { Injectable } from '@angular/core';
import { DocumentImageSizeTooSmallError } from '@api/core/errors/payments/kyc/document-image-size-too-small.error';
import { UuidService } from '@core/uuid/uuid.service';
import { KYCImages } from '@private/features/wallet/interfaces/kyc/kyc-images.interface';
import { MIME_TYPES } from '@shared/enums/mime-types.enum';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { KYCErrorResponseApi } from './dtos/errors';
import { KYCBodyRequest, KYCBodyRequestedId } from './dtos/requests';
import { KYCHttpService } from './http/kyc-http.service';
import { KYCErrorMapper } from './mappers/errors/kyc-error-mapper';

@Injectable()
export class KYCService {
  private errorMapper: KYCErrorMapper = new KYCErrorMapper();

  constructor(private KYCHttpService: KYCHttpService, private uuidService: UuidService) {}

  public request(KYCImages: KYCImages): Observable<void | never> {
    if (this.photosAreTooSmall(KYCImages)) {
      return throwError(new DocumentImageSizeTooSmallError());
    }

    return this.KYCHttpService.request(this.getBodyAsFormData(KYCImages)).pipe(
      catchError((error: KYCErrorResponseApi) => this.errorMapper.map(error))
    );
  }

  private photosAreTooSmall(KYCImages: KYCImages): boolean {
    const frontImageTooSmall = this.isImageSmallerThanOneKB(this.dataURItoBlob(KYCImages.frontSide));
    const backImageTooSmall = KYCImages.backSide ? this.isImageSmallerThanOneKB(this.dataURItoBlob(KYCImages.frontSide)) : false;

    return frontImageTooSmall || backImageTooSmall;
  }

  private isImageSmallerThanOneKB(blobImage: Blob): boolean {
    return blobImage.size < 1000;
  }

  private getBodyAsFormData(KYCImages: KYCImages): FormData {
    const body = this.getBodyAsBodyRequest(KYCImages);
    const bodyAsQueryParams = new FormData();

    Object.keys(body).forEach((key: string) => bodyAsQueryParams.append(key, body[key]));
    return bodyAsQueryParams;
  }

  private getBodyAsBodyRequest(KYCImages: KYCImages): KYCBodyRequest {
    const requestId: KYCBodyRequestedId = {
      id: this.uuidService.getUUID(),
    };

    return {
      firstImage: this.dataURItoBlob(KYCImages.frontSide),
      secondImage: KYCImages.backSide ? this.dataURItoBlob(KYCImages.backSide) : null,
      request: new Blob([JSON.stringify(requestId)], { type: MIME_TYPES.APPLICATION_JSON }),
    };
  }

  // TODO: It would be good move it into a generic service in a future		Date: 2021/08/05
  private dataURItoBlob(dataURI: string): Blob {
    // Convert base64/URLEncoded data component to raw binary data
    let rawBinary: string;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      rawBinary = atob(dataURI.split(',')[1]);
    } else {
      rawBinary = unescape(dataURI.split(',')[1]);
    }

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
