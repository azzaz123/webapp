import { AccessTokenService } from './../../core/http/access-token.service';
import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from './../../core/http/interceptors/token.interceptor';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import {
  UploadFile,
  UploadInput,
  UploadOutput,
  UploadStatus,
} from '../../shared/uploader/upload.interface';
import { ItemService } from 'app/core/item/item.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UploaderService } from 'app/shared/uploader/uploader.service';
import { ErrorsService } from 'app/core/errors/errors.service';
import { Image } from '../../core/user/user-response.interface';

@Injectable()
export class UploadService {
  private API_URL = 'api/v3/items';
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();

  constructor(
    private accesTokenService: AccessTokenService,
    private itemService: ItemService,
    private uploaderService: UploaderService
  ) {}
  public createItem(values: any, itemType: string) {
    return this.createItemWithFirstImage(values, values.images[0], itemType);
  }

  public createItemWithFirstImage(
    values: any,
    file: UploadFile,
    itemType: string
  ) {
    let inputEvent: UploadInput;
    if (itemType === ITEM_TYPES.CARS) {
      inputEvent = this.buildUploadEvent(
        values,
        file,
        this.API_URL + '/cars',
        'item_car'
      );
    } else if (itemType === ITEM_TYPES.REAL_ESTATE) {
      inputEvent = this.buildUploadEvent(
        values,
        file,
        this.API_URL + '/real_estate',
        'item_real_estate'
      );
    } else {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL, 'item');
    }
    return this.uploaderService.uploadFile(file, inputEvent);
  }

  updateItem(values: any, type: string) {
    return this.itemService.update(values, type);
  }

  private buildUploadEvent(
    values: any,
    file: UploadFile,
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
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        [fieldName]: new Blob([JSON.stringify(values)], {
          type: 'application/json',
        }),
      },
      headers: this.getUploadHeaders(url, { 'X-DeviceOS': '0' }),
      file: file,
    };
  }

  public uploadOtherImages(itemId: string, type: string) {
    const url =
      this.API_URL +
      '/' +
      (type !== 'consumer_goods' ? type + '/' : '') +
      itemId +
      '/picture' +
      (type !== 'real_estate' ? '2' : '');
    const inputEvent: UploadInput = {
      type: 'uploadRemainingImages',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: '$order',
      },
      headers: this.getUploadHeaders(url),
    };
    this.uploadInput.emit(inputEvent);
  }

  public uploadSingleImage(file: UploadFile, itemId: string, type: string) {
    const url =
      this.API_URL +
      '/' +
      (type !== 'consumer_goods' ? type + '/' : '') +
      itemId +
      '/picture' +
      (type !== 'real_estate' ? '2' : '');
    const inputEvent: UploadInput = {
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: '$order',
      },
      headers: this.getUploadHeaders(url),
      file: file,
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
