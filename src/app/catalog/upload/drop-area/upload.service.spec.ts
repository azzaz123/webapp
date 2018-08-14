import { TestBed } from '@angular/core/testing';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { environment } from '../../../../environments/environment';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_ID } from '../../../../tests/upload.fixtures.spec';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures.spec';
import { AccessTokenService } from '../../../core/http/access-token.service';
import { HttpService } from '../../../core/http/http.service';
import { TEST_HTTP_PROVIDERS } from '../../../../tests/utils.spec';
import { ITEM_ID } from '../../../../tests/item.fixtures.spec';
import { CARS_CATEGORY, REALESTATE_CATEGORY } from '../../../core/item/item-categories';
import { ITEM_TYPES } from '../../../core/item/item';

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
            return {};
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
    const appendSpy = jasmine.createSpy('append');
    beforeEach(() => {
      spyOn(http, 'getOptions').and.returnValue({
        headers: {
          toJSON() {
            return headers;
          },
          append: appendSpy
        }
      });
      accessTokenService.storeAccessToken('thetoken');
    });
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
          headers: headers,
          file: UPLOAD_FILE
        });
        expect(appendSpy).not.toHaveBeenCalled();
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
      it('should emit uploadFile event', () => {
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
          headers: headers,
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
          headers: headers,
          file: UPLOAD_FILE
        });
        expect(appendSpy).not.toHaveBeenCalled();
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
        service.uploadOtherImages(CAR_ID, 'cars');

        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers: headers
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
          headers: headers
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
          headers: headers
        });
      });
    });
  });

  describe('uploadSingleImage', () => {
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
        service.uploadSingleImage(UPLOAD_FILE, CAR_ID, ITEM_TYPES.CARS);
        expect(response).toEqual({
          type: 'uploadFile',
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order'
          },
          headers: headers,
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
          headers: headers,
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
