import { AccessTokenService } from './../../core/http/access-token.service';
import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from './../../core/http/interceptors/token.interceptor';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import { cloneDeep } from 'lodash-es';
import {
  InputType,
  OutputType,
  UploadFile,
  UploadInput,
  UploadOutput,
  UploadStatus,
} from '../../shared/uploader/upload.interface';
import { ItemService } from 'app/core/item/item.service';
import { UploaderService } from 'app/shared/uploader/uploader.service';
import { Image } from '../../core/user/user-response.interface';
import { forkJoin, Observable } from 'rxjs';
import {
  CarContent,
  ItemResponse,
  RealStateResponse,
} from 'app/core/item/item-response.interface';
import { tap } from 'rxjs/operators';

@Injectable()
export class UploadService {
  private API_URL = 'api/v3/items';

  constructor(
    private accesTokenService: AccessTokenService,
    private itemService: ItemService,
    private uploaderService: UploaderService
  ) {}
  public createItem(
    values: any,
    itemType: ITEM_TYPES
  ): Observable<UploadOutput> {
    const parsedValues = cloneDeep(values);
    delete parsedValues.images;
    return this.createItemWithFirstImage(
      parsedValues,
      values.images[0],
      itemType
    ).pipe(
      tap((response: UploadOutput) => {
        if (response.type === OutputType.done && values.images.length > 1) {
          const remainigFiles = values.images.slice(1);
          this.uploadRemainingImages(
            response.file.response.id,
            remainigFiles,
            itemType
          ).subscribe();
        }
      })
    );
  }

  private createItemWithFirstImage(
    values: any,
    file: UploadFile,
    itemType: ITEM_TYPES
  ): Observable<UploadOutput> {
    let inputEvent: UploadInput;
    if (itemType === ITEM_TYPES.CARS) {
      inputEvent = this.buildUploadEvent(
        values,
        this.API_URL + '/cars',
        'item_car'
      );
    } else if (itemType === ITEM_TYPES.REAL_ESTATE) {
      inputEvent = this.buildUploadEvent(
        values,
        this.API_URL + '/real_estate',
        'item_real_estate'
      );
    } else {
      inputEvent = this.buildUploadEvent(values, this.API_URL, 'item');
    }
    return this.uploaderService.uploadFile(file, inputEvent);
  }

  updateItem(
    values: any,
    type: ITEM_TYPES
  ): Observable<ItemResponse | CarContent | RealStateResponse> {
    const parsedValues = cloneDeep(values);
    delete parsedValues.images;
    return this.itemService.update(parsedValues, type);
  }

  private buildUploadEvent(
    values: any,
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
      type: InputType.uploadFile,
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

  private uploadRemainingImages(
    itemId: string,
    files: UploadFile[],
    itemType: ITEM_TYPES
  ): Observable<UploadOutput[]> {
    const url =
      this.API_URL +
      '/' +
      (itemType !== ITEM_TYPES.CONSUMER_GOODS ? itemType + '/' : '') +
      itemId +
      '/picture' +
      (itemType !== ITEM_TYPES.REAL_ESTATE ? '2' : '');

    const imagesRequest: Observable<UploadOutput>[] = [];

    files.forEach((file: UploadFile) => {
      const inputEvent: UploadInput = {
        type: InputType.uploadRemainingImages,
        url: environment.baseUrl + url,
        method: 'POST',
        fieldName: 'image',
        data: {
          order: '$order',
        },
        headers: this.getUploadHeaders(url),
      };
      imagesRequest.push(this.uploaderService.uploadFile(file, inputEvent));
    });
    return forkJoin(imagesRequest);
  }

  public uploadSingleImage(file: UploadFile, itemId: string, type: ITEM_TYPES) {
    const url =
      this.API_URL +
      '/' +
      (type !== ITEM_TYPES.CONSUMER_GOODS ? type + '/' : '') +
      itemId +
      '/picture' +
      (type !== ITEM_TYPES.REAL_ESTATE ? '2' : '');
    const inputEvent: UploadInput = {
      type: InputType.uploadFile,
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: '$order',
      },
      headers: this.getUploadHeaders(url),
    };
    return this.uploaderService.uploadFile(file, inputEvent);
  }

  private getUploadHeaders(url: string, additionalHeaders?: any): any {
    const timestamp = Date.now();
    const signature = this.accesTokenService.getTokenSignature(
      url,
      'POST',
      timestamp
    );

    return {
      ...additionalHeaders,
      [TOKEN_AUTHORIZATION_HEADER_NAME]: `Bearer ${this.accesTokenService.accessToken}`,
      [TOKEN_SIGNATURE_HEADER_NAME]: signature,
      [TOKEN_TIMESTAMP_HEADER_NAME]: timestamp.toString(),
    };
  }

  public updateOrder(files: UploadFile[], itemId: string) {
    const picturesOrder = {};
    files.forEach((file, index) => {
      picturesOrder[file.response?.id || file.response] = index;
    });
    return this.itemService.updatePicturesOrder(itemId, picturesOrder);
  }

  public convertImagesToFiles(images: Image[]) {
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
          status: UploadStatus.Done,
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

  public onDeleteImage(itemId: string, imageId: string) {
    return this.itemService.deletePicture(itemId, imageId);
  }
}
