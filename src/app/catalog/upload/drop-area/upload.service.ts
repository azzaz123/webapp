import { EventEmitter, Injectable } from '@angular/core';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { environment } from '../../../../environments/environment';
import { AccessTokenService, HttpService } from 'shield';

@Injectable()
export class UploadService {

  private API_URL: string = environment.baseUrl + 'api/v3/items/cars';
  uploadInput: EventEmitter<UploadInput> = new EventEmitter();

  constructor(private accessTokenService: AccessTokenService, private http: HttpService) {
  }

  public createItemWithFirstImage(values: any, file: UploadFile) {
    const inputEvent: UploadInput = {
      type: 'uploadFile',
      url: this.API_URL,
      method: 'POST',
      fieldName: 'image',
      data: {
        item_car: new Blob([JSON.stringify(values)], {
          type: 'application/json'
        })
      },
      headers: this.http.getOptions(null, this.API_URL, 'POST').headers.toJSON(),
      file: file
    };
    this.uploadInput.emit(inputEvent);
  }

  public uploadOtherImages(itemId: string) {
    const url = this.API_URL + '/' + itemId + '/picture';
    const inputEvent: UploadInput = {
      type: 'uploadAll',
      url: url,
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
