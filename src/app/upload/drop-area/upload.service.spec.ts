import { TOKEN_AUTHORIZATION_HEADER_NAME, TOKEN_SIGNATURE_HEADER_NAME, TOKEN_TIMESTAMP_HEADER_NAME } from './../../core/http/interceptors/token.interceptor';
import { TestBed } from '@angular/core/testing';
import { UploadService } from './upload.service';
import { environment } from '../../../environments/environment';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_ID } from '../../../tests/upload.fixtures.spec';
import { USER_LOCATION_COORDINATES } from '../../../tests/user.fixtures.spec';
import { AccessTokenService } from '../../core/http/access-token.service';
import { ITEM_ID } from '../../../tests/item.fixtures.spec';
import { CARS_CATEGORY, REALESTATE_CATEGORY } from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import { UploadInput } from '../../shared/uploader/upload.interface';

describe('UploadService', () => {

  let service: UploadService;
  let response: UploadInput;
  let accessTokenService: AccessTokenService;
  const TIMESTAMP = 123456789;
  const headers = {
    [TOKEN_AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
    [TOKEN_SIGNATURE_HEADER_NAME]: 'thesignature',
    [TOKEN_TIMESTAMP_HEADER_NAME]: `${TIMESTAMP}`
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UploadService,
        {
          provide: AccessTokenService, useValue: {
            accessToken: 'thetoken',
            getTokenSignature() {
              return 'thesignature';
            }
          }
        }
      ]
    });
    service = TestBed.get(UploadService);
    accessTokenService = TestBed.get(AccessTokenService);
    response = null;
    service.uploadInput.subscribe((r: UploadInput) => {
      response = r;
    });

    spyOn<any>(window, 'Date').and.returnValue({ getTime: () => TIMESTAMP });
  });

  describe('createItemWithFirstImage', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: CARS_CATEGORY
        };
        service.createItemWithFirstImage(VALUES, UPLOAD_FILE, ITEM_TYPES.CARS);
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
            ...headers,
            'X-DeviceOS': '0'
          },
          file: UPLOAD_FILE
        });
      });

      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: CARS_CATEGORY
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES
        };

        it('should send values without user location', () => {
          service.createItemWithFirstImage(VALUES_WITH_LOCATION, UPLOAD_FILE, ITEM_TYPES.CARS);

          expect(response.data.item_car).toEqual(new Blob([JSON.stringify(VALUES)]));
        });
      });
    });

    describe('normal item', () => {
      xit('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200'
        };
        service.createItemWithFirstImage(VALUES, UPLOAD_FILE, ITEM_TYPES.CONSUMER_GOODS);
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
          headers: {
            ...headers,
            'X-DeviceOS': '0'
          },
          file: UPLOAD_FILE
        });
      });
      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200'
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES
        };

        it('should send values without user location', () => {
          service.createItemWithFirstImage(VALUES_WITH_LOCATION, UPLOAD_FILE, ITEM_TYPES.CONSUMER_GOODS);

          expect(response.data.item).toEqual(new Blob([JSON.stringify(VALUES)]));
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        const VALUES_FINAL: any = {
          test: 'hola',
          hola: 'hey',
          location: USER_LOCATION_COORDINATES
        };

        const VALUES: any = {
          ...VALUES_FINAL,
          category_id: REALESTATE_CATEGORY,
          id: 100
        };

        service.createItemWithFirstImage(VALUES, UPLOAD_FILE, ITEM_TYPES.REAL_ESTATE);

        expect(response).toEqual({
          type: 'uploadFile',
          url: environment.baseUrl + 'api/v3/items/real_estate',
          method: 'POST',
          fieldName: 'image',
          data: {
            item_real_estate: new Blob([JSON.stringify(VALUES_FINAL)], {
              type: 'application/json'
            })
          },
          headers: {
            ...headers,
            'X-DeviceOS': '0'
          },
          file: UPLOAD_FILE
        });
      });
    });
  });

  describe('uploadOtherImages', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(CAR_ID, 'cars');

        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(ITEM_ID, 'real_estate');

        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/real_estate/' + ITEM_ID + '/picture',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers
        });
      });
    });

    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(ITEM_ID, 'consumer_goods');

        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers
        });
      });
    });
  });

  describe('uploadSingleImage', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        service.uploadSingleImage(UPLOAD_FILE, CAR_ID, ITEM_TYPES.CARS);
        expect(response).toEqual({
          type: 'uploadFile',
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers,
          file: UPLOAD_FILE
        });
      });
    });
    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        service.uploadSingleImage(UPLOAD_FILE, ITEM_ID, ITEM_TYPES.CONSUMER_GOODS);
        expect(response).toEqual({
          type: 'uploadFile',
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers,
          file: UPLOAD_FILE
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
      const FILES = [UPLOAD_FILE, UPLOAD_FILE, UPLOAD_FILE];
      service.updateOrder(FILES);
      expect(response).toEqual({
        type: 'updateOrder',
        files: FILES
      });
    });
  });

  describe('setInitialImages', () => {
    it('should emit initialImages event', () => {
      const FILES = [UPLOAD_FILE, UPLOAD_FILE, UPLOAD_FILE];

      service.setInitialImages(FILES);

      expect(response).toEqual({
        type: 'initialImages',
        files: FILES
      });
    });
  });
});
