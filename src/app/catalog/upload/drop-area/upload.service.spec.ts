import { TestBed, inject } from '@angular/core/testing';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { TEST_HTTP_PROVIDERS, AccessTokenService, HttpService } from 'shield';
import { environment } from '../../../../environments/environment';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_ID } from '../../../../tests/upload.fixtures';

describe('UploadService', () => {

  let service: UploadService;
  let response: UploadInput;
  let accessTokenService: AccessTokenService;
  let http: HttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ...TEST_HTTP_PROVIDERS,
        UploadService,
        {
          provide: HttpService, useValue: {
          getOptions() {
            return {}
          }
        }
        }
      ]
    });
    service = TestBed.get(UploadService);
    accessTokenService = TestBed.get(AccessTokenService);
    http = TestBed.get(HttpService);
    response = null;
    service.uploadInput.subscribe((r: UploadInput) => {
      response = r;
    });
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('createItemWithFirstImage', () => {
    const headers = {
      'Authorization': 'Bearer thetoken'
    };
    beforeEach(() => {
      spyOn(http, 'getOptions').and.returnValue({
        headers: {
          toJSON() {
            return headers;
          }
        }
      });
      accessTokenService.storeAccessToken('thetoken');
    });
    describe('car', () => {
      it('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '100'
        };
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
          headers: headers,
          file: UPLOAD_FILE
        });
      });
    });
    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200'
        };
        service.createItemWithFirstImage(VALUES, UPLOAD_FILE);
        expect(response).toEqual({
          type: 'uploadFile',
          url: environment.baseUrl + 'api/v3/items',
          method: 'POST',
          fieldName: 'image',
          data: {
            item: new Blob([JSON.stringify(VALUES)], {
              type: 'application/json'
            })
          },
          headers: headers,
          file: UPLOAD_FILE
        });
      });
    });
  });

  describe('uploadOtherImages', () => {
    const headers = {
      'Authorization': 'Bearer thetoken'
    };
    beforeEach(() => {
      accessTokenService.storeAccessToken('thetoken');
      spyOn(http, 'getOptions').and.returnValue({
        headers: {
          toJSON() {
            return headers;
          }
        }
      });
    });
    describe('car', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(CAR_ID, '/cars');
        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers: headers
        });
      });
    });
    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(CAR_ID, '');
        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/' + CAR_ID + '/picture',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers: headers
        });
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
