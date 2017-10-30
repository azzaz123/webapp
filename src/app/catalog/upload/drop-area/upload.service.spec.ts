import { TestBed, inject } from '@angular/core/testing';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { TEST_HTTP_PROVIDERS, AccessTokenService } from 'shield';
import { environment } from '../../../../environments/environment';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_ID } from '../../../../tests/upload.fixtures';

describe('UploadService', () => {

  let service: UploadService;
  let response: UploadInput;
  let accessTokenService: AccessTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        UploadService
      ]
    });
    service = TestBed.get(UploadService);
    accessTokenService = TestBed.get(AccessTokenService);
    response = null;
    service.uploadInput.subscribe((r: UploadInput) => {
      response = r;
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('createItemWithFirstImage', () => {
    it('should emit uploadFile event', () => {
      const VALUES: any = {
        test: 'hola',
        hola: 'hey'
      };
      accessTokenService.storeAccessToken('thetoken');
      service.createItemWithFirstImage(VALUES, UPLOAD_FILE);
      expect(response).toEqual({
        type: 'uploadFile',
        url: environment.baseUrl + 'api/v3/items/cars',
        method: 'POST',
        fieldName: 'image',
        data: {
          item_car: new Blob([JSON.stringify(VALUES)], {
            type: 'application/json'
          })
        },
        headers: {
          'Authorization': 'Bearer thetoken'
        },
        file: UPLOAD_FILE
      });
    });
  });

  describe('uploadOtherImages', () => {
    it('should emit uploadFile event', () => {
      accessTokenService.storeAccessToken('thetoken');
      service.uploadOtherImages(CAR_ID);
      expect(response).toEqual({
        type: 'uploadAll',
        url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture',
        method: 'POST',
        fieldName: 'image',
        data: {
          order: '$order'
        },
        headers: {
          'Authorization': 'Bearer thetoken'
        }
      });
    });
  });

  describe('removeImage', () => {
    it('should emit uploadFile event', () => {
      service.removeImage(UPLOAD_FILE);
      expect(response).toEqual({
        type: 'remove',
        id: UPLOAD_FILE_ID
      });
    });
  });

  describe('updateOrder', () => {
    it('should emit uploadFile event', () => {
      const FILES: UploadFile[] = [UPLOAD_FILE, UPLOAD_FILE, UPLOAD_FILE];
      service.updateOrder(FILES);
      expect(response).toEqual({
        type: 'updateOrder',
        files: FILES
      });
    });
  });
});
