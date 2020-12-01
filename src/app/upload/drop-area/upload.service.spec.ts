import {
  TOKEN_AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from './../../core/http/interceptors/token.interceptor';
import { TestBed } from '@angular/core/testing';
import { UploadService } from './upload.service';
import { environment } from '../../../environments/environment';
import {
  CAR_ID,
  UPLOAD_FILE,
  UPLOAD_FILE_DONE,
  UPLOAD_FILE_DONE_2,
} from '../../../tests/upload.fixtures.spec';
import { USER_LOCATION_COORDINATES } from '../../../tests/user.fixtures.spec';
import { AccessTokenService } from '../../core/http/access-token.service';
import { ITEM_ID } from '../../../tests/item.fixtures.spec';
import {
  CARS_CATEGORY,
  REALESTATE_CATEGORY,
} from '../../core/item/item-categories';
import { ITEM_TYPES } from '../../core/item/item';
import { InputType, UploadInput } from '../../shared/uploader/upload.interface';
import { ItemService } from 'app/core/item/item.service';
import { of } from 'rxjs';
import { UploaderService } from 'app/shared/uploader/uploader.service';

describe('UploadService', () => {
  let service: UploadService;
  let response: UploadInput;
  let itemService: ItemService;
  let uploaderService: UploaderService;
  let accessTokenService: AccessTokenService;
  const TIMESTAMP = 123456789;
  const headers = {
    [TOKEN_AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
    [TOKEN_SIGNATURE_HEADER_NAME]: 'thesignature',
    [TOKEN_TIMESTAMP_HEADER_NAME]: `${TIMESTAMP}`,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UploadService,
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'thetoken',
            getTokenSignature() {
              return 'thesignature';
            },
          },
        },
        {
          provide: ItemService,
          useValue: {
            deletePicture() {
              return of(null);
            },
            updatePicturesOrder() {
              return of(null);
            },
          },
        },
        {
          provide: UploaderService,
          useValue: {
            uploadFile() {
              return of(null);
            },
          },
        },
      ],
    });
    service = TestBed.inject(UploadService);
    accessTokenService = TestBed.inject(AccessTokenService);
    itemService = TestBed.inject(ItemService);
    uploaderService = TestBed.inject(UploaderService);
    response = null;
    service.uploadInput.subscribe((r: UploadInput) => {
      response = r;
    });

    spyOn(Date, 'now').and.returnValues(TIMESTAMP);
  });

  describe('createItemWithFirstImage', () => {
    describe('car', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile');
      });

      it('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: CARS_CATEGORY,
        };
        service.createItemWithFirstImage(VALUES, UPLOAD_FILE, ITEM_TYPES.CARS);
        expect(uploaderService.uploadFile).toBeCalledWith(UPLOAD_FILE, {
          type: InputType.uploadFile,
          url: environment.baseUrl + 'api/v3/items/cars',
          method: 'POST',
          fieldName: 'image',
          data: {
            item_car: new Blob([JSON.stringify(VALUES)], {
              type: 'application/json',
            }),
          },
          headers: {
            ...headers,
            'X-DeviceOS': '0',
          },
          file: UPLOAD_FILE,
        });
      });

      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: CARS_CATEGORY,
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES,
        };

        it('should send values without user location', () => {
          service.createItemWithFirstImage(
            VALUES_WITH_LOCATION,
            UPLOAD_FILE,
            ITEM_TYPES.CARS
          );

          expect(uploaderService.uploadFile).toBeCalledWith(UPLOAD_FILE, {
            type: InputType.uploadFile,
            url: environment.baseUrl + 'api/v3/items/cars',
            method: 'POST',
            fieldName: 'image',
            data: {
              item_car: new Blob([JSON.stringify(VALUES)], {
                type: 'application/json',
              }),
            },
            headers: {
              ...headers,
              'X-DeviceOS': '0',
            },
            file: UPLOAD_FILE,
          });
        });
      });
    });

    describe('normal item', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile');
      });

      it('should emit uploadFile event', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200',
        };
        service.createItemWithFirstImage(
          VALUES,
          UPLOAD_FILE,
          ITEM_TYPES.CONSUMER_GOODS
        );
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
          type: InputType.uploadFile,
          url: environment.baseUrl + 'api/v3/items',
          method: 'POST',
          fieldName: 'image',
          data: {
            item: new Blob([JSON.stringify(VALUES)], {
              type: 'application/json',
            }),
          },
          headers: {
            ...headers,
            'X-DeviceOS': '0',
          },
          file: UPLOAD_FILE,
        });
      });
      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200',
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES,
        };

        it('should send values without user location', () => {
          service.createItemWithFirstImage(
            VALUES_WITH_LOCATION,
            UPLOAD_FILE,
            ITEM_TYPES.CONSUMER_GOODS
          );

          expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
            type: InputType.uploadFile,
            url: environment.baseUrl + 'api/v3/items',
            method: 'POST',
            fieldName: 'image',
            data: {
              item: new Blob([JSON.stringify(VALUES)], {
                type: 'application/json',
              }),
            },
            headers: {
              ...headers,
              'X-DeviceOS': '0',
            },
            file: UPLOAD_FILE,
          });
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile');

        const VALUES_FINAL: any = {
          test: 'hola',
          hola: 'hey',
          location: USER_LOCATION_COORDINATES,
        };

        const VALUES: any = {
          ...VALUES_FINAL,
          category_id: REALESTATE_CATEGORY,
          id: 100,
        };

        service.createItemWithFirstImage(
          VALUES,
          UPLOAD_FILE,
          ITEM_TYPES.REAL_ESTATE
        );

        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
          type: InputType.uploadFile,
          url: environment.baseUrl + 'api/v3/items/real_estate',
          method: 'POST',
          fieldName: 'image',
          data: {
            item_real_estate: new Blob([JSON.stringify(VALUES_FINAL)], {
              type: 'application/json',
            }),
          },
          headers: {
            ...headers,
            'X-DeviceOS': '0',
          },
          file: UPLOAD_FILE,
        });
      });
    });
  });

  describe('uploadOtherImages', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(CAR_ID, 'cars');

        expect(response).toEqual({
          type: 'uploadRemainingImages',
          url:
            environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order',
          },
          headers,
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(ITEM_ID, 'real_estate');

        expect(response).toEqual({
          type: 'uploadRemainingImages',
          url:
            environment.baseUrl +
            'api/v3/items/real_estate/' +
            ITEM_ID +
            '/picture',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order',
          },
          headers,
        });
      });
    });

    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        service.uploadOtherImages(ITEM_ID, 'consumer_goods');

        expect(response).toEqual({
          type: 'uploadRemainingImages',
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order',
          },
          headers,
        });
      });
    });
  });

  describe('uploadSingleImage', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile');
        service.uploadSingleImage(UPLOAD_FILE, CAR_ID, ITEM_TYPES.CARS);
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
          type: InputType.uploadFile,
          url:
            environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order',
          },
          headers,
          file: UPLOAD_FILE,
        });
      });
    });
    describe('normal item', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile');
      });
      it('should emit uploadFile event', () => {
        service.uploadSingleImage(
          UPLOAD_FILE,
          ITEM_ID,
          ITEM_TYPES.CONSUMER_GOODS
        );
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
          type: InputType.uploadFile,
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '$order',
          },
          headers,
          file: UPLOAD_FILE,
        });
      });
    });
  });

  describe('removeImage', () => {
    it('should emit uploadFile event', () => {
      spyOn(itemService, 'deletePicture');

      service.onDeleteImage('123', UPLOAD_FILE.id);

      expect(itemService.deletePicture).toHaveBeenCalledWith(
        '123',
        UPLOAD_FILE.id
      );
    });
  });

  describe('updateOrder', () => {
    it('should emit uploadFile event', () => {
      spyOn(itemService, 'updatePicturesOrder');
      const FILES = [UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2];
      const expectedOrder = {
        [UPLOAD_FILE_DONE.response.id]: 0,
        [UPLOAD_FILE_DONE_2.response.id]: 1,
      };

      service.updateOrder(FILES, '123');

      expect(itemService.updatePicturesOrder).toHaveBeenCalledWith(
        '123',
        expectedOrder
      );
    });
  });
});
