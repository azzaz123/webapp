import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Headers, RequestOptions } from '@angular/http';
import { HttpService } from '../../core/http/http.service';
import { CARS_CATEGORY, REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import { UploadFile, UploadInput } from '../../shared/uploader/upload.interface';

@Injectable()
export class UploadService {

  private API_URL = 'api/v3/items';
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();

  constructor(private http: HttpService) {
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
    const options: RequestOptions = new RequestOptions({headers: new Headers({'X-DeviceOS': '0'})});
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
      headers: this.http.getOptions(options, url, 'POST').headers.toJSON(),
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
      headers: this.http.getOptions(null, url, 'POST').headers.toJSON(),
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
      headers: this.http.getOptions(null, url, 'POST').headers.toJSON(),
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

}
