import { EventEmitter, Injectable } from '@angular/core';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { environment } from '../../../../environments/environment';
import { HttpService } from 'shield';

@Injectable()
export class UploadService {

  private API_URL: string = 'api/v3/items';
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();

  constructor(private http: HttpService) {
  }

  public createItemWithFirstImage(values: any, file: UploadFile) {
    let inputEvent: UploadInput;
    if (values.category_id === '100') {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL + '/cars', 'item_car');
    } else {
      inputEvent = this.buildUploadEvent(values, file, this.API_URL, 'item');
    }
    this.uploadInput.emit(inputEvent);
  }

  private buildUploadEvent(values: any, file: UploadFile, url: string, fieldName: string): UploadInput {
    delete values.location;
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
      headers: this.http.getOptions(null, url, 'POST').headers.toJSON(),
      file: file
    };
  }

  public uploadOtherImages(itemId: string, extraPath: string) {
    const url = this.API_URL + extraPath + '/' + itemId + '/picture';
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

  public removeImage(file: UploadFile) {
    const inputEvent: UploadInput = {
      type: 'remove',
      id: file.id
    };
    this.uploadInput.emit(inputEvent);
  }

  public updateOrder(files: UploadFile[]) {
    const inputEvent: UploadInput = {
      type: 'updateOrder',
      files: files
    };
    this.uploadInput.emit(inputEvent);
  }

}
