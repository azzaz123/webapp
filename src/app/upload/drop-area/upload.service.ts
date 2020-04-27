import { AccessTokenService } from './../../core/http/access-token.service';
import { TOKEN_AUTHORIZATION_HEADER_NAME, TOKEN_SIGNATURE_HEADER_NAME, TOKEN_TIMESTAMP_HEADER_NAME } from './../../core/http/interceptors/token.interceptor';
import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import { UploadFile, UploadInput } from '../../shared/uploader/upload.interface';

@Injectable()
export class UploadService {

  private API_URL = 'api/v3/items';
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();

  constructor(private accesTokenService: AccessTokenService) {
  }

  public createItemWithFirstImage(values: any, file: UploadFile, itemType: string) {
    let inputEvent: UploadInput;
    if (itemType === ITEM_TYPES.CARS) {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL + '/cars', 'item_car');
    } else if (itemType === ITEM_TYPES.REAL_ESTATE) {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL + '/real_estate', 'item_real_estate');
    } else {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL, 'item');
    }
    this.uploadInput.emit(inputEvent);
  }

  private buildUploadEvent(values: any, file: UploadFile, url: string, fieldName: string): UploadInput {
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
          type: 'application/json'
        })
      },
      headers: this.getUploadHeaders(url, { 'X-DeviceOS': '0' }),
      file: file
    };
  }

  public uploadOtherImages(itemId: string, type: string) {
    const url = this.API_URL + '/' +
      (type !== 'consumer_goods' ? type + '/' : '') + itemId + '/picture' +
      (type !== 'real_estate' ? '2' : '');
    const inputEvent: UploadInput = {
      type: 'uploadAll',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: '$order'
      },
      headers: this.getUploadHeaders(url),
    };
    this.uploadInput.emit(inputEvent);
  }

  public uploadSingleImage(file: UploadFile, itemId: string, type: string) {
    const url = this.API_URL + '/' +
      (type !== 'consumer_goods' ? type + '/' : '') + itemId + '/picture' +
      (type !== 'real_estate' ? '2' : '');
    const inputEvent: UploadInput = {
      type: 'uploadFile',
      url: environment.baseUrl + url,
      method: 'POST',
      fieldName: 'image',
      data: {
        order: '$order'
      },
      headers: this.getUploadHeaders(url),
      file: file
    };
    this.uploadInput.emit(inputEvent);
  }

  public removeImage(file: UploadFile) {
    const inputEvent: UploadInput = {
      type: 'remove',
      id: file.id
    };
    this.uploadInput.emit(inputEvent);
  }

  public updateOrder(files) {
    const inputEvent: UploadInput = {
      type: 'updateOrder',
      files: files
    };
    this.uploadInput.emit(inputEvent);
  }

  public setInitialImages(files) {
    const inputEvent: UploadInput = {
      type: 'initialImages',
      files: [...files]
    };
    this.uploadInput.emit(inputEvent);
  }

  private getUploadHeaders(url: string, additionalHeaders?: any): any {
    const timestamp = new Date().getTime();
    const signature = this.accesTokenService.getTokenSignature(url, 'POST', timestamp);

    return {
      ...additionalHeaders,
      [TOKEN_AUTHORIZATION_HEADER_NAME]: `Bearer ${this.accesTokenService.accessToken}`,
      [TOKEN_SIGNATURE_HEADER_NAME]: signature,
      [TOKEN_TIMESTAMP_HEADER_NAME]: timestamp.toString()
    }
  }

}
