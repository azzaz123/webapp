import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccessTokenService } from '@core/http/access-token.service';
import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from '@core/http/interceptors/token/token.interceptor';
import { ITEM_TYPES } from '@core/item/item';
import { REALESTATE_CATEGORY } from '@core/item/item-categories';
import { CarContent, ItemResponse, RealEstateResponse } from '@core/item/item-response.interface';
import { ItemService } from '@core/item/item.service';
import { Image } from '@core/user/user-response.interface';
import { environment } from '@environments/environment';
import {
  ICarUploadForm,
  IProductUploadForm,
  IRealEstateUploadForm,
  OUTPUT_TYPE,
  PendingFiles,
  UploadFile,
  UploadInput,
  UploadOutput,
  UPLOAD_STATUS,
} from '@shared/uploader/upload.interface';
import { UploaderService } from '@shared/uploader/uploader.service';
import { cloneDeep } from 'lodash-es';
import { combineLatest, Observable } from 'rxjs';

@Injectable()
export class UploadService {
  private API_URL = 'api/v3/items';

  constructor(private accesTokenService: AccessTokenService, private itemService: ItemService, private uploaderService: UploaderService) {}
  public createItem(values: IProductUploadForm | IRealEstateUploadForm | ICarUploadForm, itemType: ITEM_TYPES): Observable<UploadOutput> {
    const parsedValues = cloneDeep(values);
    delete parsedValues.images;

    // TODO THIS WILL BE REFACTORED WITH THE PARALIZATION OF UPLOAD FILES.
    return new Observable((observer) => {
      this.createItemWithFirstImage(parsedValues, values.images[0], itemType).subscribe(
        (response: UploadOutput) => {
          if (values.images.length > 1) {
            if (response.type === OUTPUT_TYPE.done) {
              const remainigFiles = values.images.slice(1);
              this.uploadRemainingImages(response.file.response.id, remainigFiles, itemType).subscribe(
                (fileResonses: UploadOutput[]) => {
                  if (fileResonses.every((file) => file.type === OUTPUT_TYPE.done)) {
                    observer.next(response);
                    observer.complete();
                  } else {
                    const partialResponse: UploadOutput = cloneDeep(response);
                    partialResponse.pendingFiles = this.calculatePendingFiles(fileResonses);
                    partialResponse.type = OUTPUT_TYPE.uploading;
                    observer.next(partialResponse);
                  }
                },
                (error: HttpErrorResponse) => {
                  observer.error(error);
                }
              );
            } else {
              observer.next(response);
            }
          } else {
            observer.next(response);
            if (response.type === OUTPUT_TYPE.done) {
              observer.complete();
            }
          }
        },
        (error: HttpErrorResponse) => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private calculatePendingFiles(files: UploadOutput[]): PendingFiles {
    const totalFiles = files.length + 1;
    const currentUploading = files.filter((file) => file.type === OUTPUT_TYPE.done).length + 2;
    return { totalFiles, currentUploading };
  }

  private createItemWithFirstImage(
    values: IProductUploadForm | IRealEstateUploadForm | ICarUploadForm,
    file: UploadFile,
    itemType: ITEM_TYPES
  ): Observable<UploadOutput> {
    let inputEvent: UploadInput;
    if (itemType === ITEM_TYPES.CARS) {
      inputEvent = this.buildUploadEvent(values, this.API_URL + '/cars', 'item_car');
    } else if (itemType === ITEM_TYPES.REAL_ESTATE) {
      inputEvent = this.buildUploadEvent(values, this.API_URL + '/real_estate', 'item_real_estate');
    } else {
      inputEvent = this.buildUploadEvent(values, this.API_URL, 'item');
    }
    return this.uploaderService.uploadFile(file, inputEvent);
  }

  updateItem(
    values: IProductUploadForm | IRealEstateUploadForm | ICarUploadForm,
    type: ITEM_TYPES
  ): Observable<ItemResponse | CarContent | RealEstateResponse> {
    const parsedValues = cloneDeep(values);
    delete parsedValues.images;
    return this.itemService.update(parsedValues, type);
  }

  private buildUploadEvent(
    values: IProductUploadForm | IRealEstateUploadForm | ICarUploadForm,
    url: string,
    fieldName: string
  ): UploadInput {
    if (values.category_id !== REALESTATE_CATEGORY) {
      delete values.location;
    } else {
      delete values.id;
      delete values.category_id;
    }

    return {
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        [fieldName]: new Blob([JSON.stringify(values)], {
          type: 'application/json',
        }),
      },
      headers: this.getUploadHeaders(url, { 'X-DeviceOS': '0' }),
    };
  }

  private uploadRemainingImages(itemId: string, files: UploadFile[], itemType: ITEM_TYPES): Observable<UploadOutput[]> {
    const imagesRequest: Observable<UploadOutput>[] = [];
    files.forEach((file: UploadFile) => {
      imagesRequest.push(this.uploadSingleImage(file, itemId, itemType));
    });
    return combineLatest(imagesRequest);
  }

  public uploadSingleImage(file: UploadFile, itemId: string, type: ITEM_TYPES): Observable<UploadOutput> {
    const url =
      this.API_URL +
      '/' +
      (type !== ITEM_TYPES.CONSUMER_GOODS ? type + '/' : '') +
      itemId +
      '/picture' +
      (type !== ITEM_TYPES.REAL_ESTATE ? '2' : '');
    const inputEvent: UploadInput = {
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: file.fileIndex.toString(),
      },
      headers: this.getUploadHeaders(url),
    };
    return this.uploaderService.uploadFile(file, inputEvent);
  }

  private getUploadHeaders(url: string, additionalHeaders?: any): any {
    const timestamp = Date.now();
    const signature = this.accesTokenService.getTokenSignature(url, 'POST', timestamp);

    return {
      ...additionalHeaders,
      [TOKEN_AUTHORIZATION_HEADER_NAME]: `Bearer ${this.accesTokenService.accessToken}`,
      [TOKEN_SIGNATURE_HEADER_NAME]: signature,
      [TOKEN_TIMESTAMP_HEADER_NAME]: timestamp.toString(),
    };
  }

  public updateOrder(files: UploadFile[], itemId: string): Observable<void> {
    const picturesOrder = {};
    files.forEach((file, index) => {
      picturesOrder[file.response?.id || file.response] = index;
    });
    return this.itemService.updatePicturesOrder(itemId, picturesOrder);
  }

  public convertImagesToFiles(images: Image[]): any[] {
    return images.map((image: Image, index: number) => {
      return {
        fileIndex: index,
        preview: image.urls_by_size.medium,
        file: {
          lastModifiedDate: '',
          name: '',
          webkitRelativePath: '',
          size: 1,
          type: 'jpg',
          msClose() {},
          msDetachStream() {},
          slice() {
            return new Blob();
          },
        },
        id: image.id,
        lastModifiedDate: new Date(),
        name: '',
        size: 1,
        type: 'jpg',
        progress: {
          status: UPLOAD_STATUS.Done,
          data: {
            percentage: 100,
            speed: null,
            speedHuman: null,
          },
        },
        response: image,
      };
    });
  }

  public onDeleteImage(itemId: string, imageId: string): Observable<void> {
    return this.itemService.deletePicture(itemId, imageId);
  }
}
