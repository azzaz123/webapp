import { TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import {
  AUTHORIZATION_HEADER_NAME,
  TOKEN_SIGNATURE_HEADER_NAME,
  TOKEN_TIMESTAMP_HEADER_NAME,
} from '@core/http/interceptors/token/token.interceptor';
import { ITEM_TYPES } from '@core/item/item';
import { CARS_CATEGORY, REALESTATE_CATEGORY } from '@core/item/item-categories';
import { ItemService } from '@core/item/item.service';
import { environment } from '@environments/environment';
import { ITEM_ID } from '@fixtures/item.fixtures.spec';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_2, UPLOAD_FILE_DONE, UPLOAD_FILE_DONE_2 } from '@fixtures/upload.fixtures.spec';
import { USER_LOCATION_COORDINATES } from '@fixtures/user.fixtures.spec';
import { OUTPUT_TYPE } from '@shared/uploader/upload.interface';
import { UploaderService } from '@shared/uploader/uploader.service';
import { of } from 'rxjs';
import { UploadService } from './upload.service';

describe('UploadService', () => {
  let service: UploadService;
  let itemService: ItemService;
  let uploaderService: UploaderService;
  let accessTokenService: AccessTokenService;
  const TIMESTAMP = 123456789;
  const headers = {
    [AUTHORIZATION_HEADER_NAME]: 'Bearer thetoken',
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

    spyOn(Date, 'now').and.returnValue(TIMESTAMP);
  });

  describe('createItemWithFirstImage', () => {
    describe('car', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile').and.callThrough();
      });

      it('should emit uploadFile event', () => {
        const VALUES: any = {
          category_id: CARS_CATEGORY,
          images: [UPLOAD_FILE],
        };

        service.createItem(VALUES, ITEM_TYPES.CARS).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
        expect(uploaderService.uploadFile).toBeCalledWith(UPLOAD_FILE, {
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
        });
      });

      describe('with user location', () => {
        const VALUES: any = {
          images: [UPLOAD_FILE],
          category_id: CARS_CATEGORY,
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES,
        };

        it('should send values without user location', () => {
          service.createItem(VALUES_WITH_LOCATION, ITEM_TYPES.CARS).subscribe();

          expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
          expect(uploaderService.uploadFile).toBeCalledWith(UPLOAD_FILE, {
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
          });
        });
      });
    });

    describe('normal item', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile').and.callThrough();
      });

      it('should emit uploadFile event', () => {
        const VALUES: any = {
          images: [UPLOAD_FILE],
          category_id: '200',
        };

        service.createItem(VALUES, ITEM_TYPES.CONSUMER_GOODS).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
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
        });
      });
      describe('with user location', () => {
        const VALUES: any = {
          images: [UPLOAD_FILE],
          category_id: '200',
        };
        const VALUES_WITH_LOCATION: any = {
          ...VALUES,
          location: USER_LOCATION_COORDINATES,
        };

        it('should send values without user location', () => {
          service.createItem(VALUES_WITH_LOCATION, ITEM_TYPES.CONSUMER_GOODS).subscribe();

          expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
          expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
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
          });
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile').and.callThrough();

        const VALUES_FINAL: any = {
          images: [UPLOAD_FILE],
          location: USER_LOCATION_COORDINATES,
        };

        const VALUES: any = {
          ...VALUES_FINAL,
          category_id: REALESTATE_CATEGORY,
          id: 100,
        };

        service.createItem(VALUES, ITEM_TYPES.REAL_ESTATE).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES_FINAL.images.length);
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
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
        });
      });
    });
  });

  describe('uploadOtherImages', () => {
    describe('car', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile').and.returnValue(of({ type: OUTPUT_TYPE.done, file: { response: { id: CAR_ID } } }));
        const VALUES: any = {
          images: [UPLOAD_FILE, UPLOAD_FILE_2],
          category_id: '200',
        };

        service.createItem(VALUES, ITEM_TYPES.CARS).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
        expect(uploaderService.uploadFile).toHaveBeenLastCalledWith(UPLOAD_FILE_2, {
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '0',
          },
          headers,
        });
      });
    });

    describe('real estate', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile').and.returnValue(of({ type: OUTPUT_TYPE.done, file: { response: { id: ITEM_ID } } }));
        const VALUES: any = {
          images: [UPLOAD_FILE, UPLOAD_FILE_2],
          category_id: '200',
        };

        service.createItem(VALUES, ITEM_TYPES.REAL_ESTATE).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
        expect(uploaderService.uploadFile).toHaveBeenLastCalledWith(UPLOAD_FILE_2, {
          url: environment.baseUrl + 'api/v3/items/real_estate/' + ITEM_ID + '/picture',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '0',
          },
          headers,
        });
      });
    });

    describe('normal item', () => {
      it('should emit uploadFile event', () => {
        spyOn(uploaderService, 'uploadFile').and.returnValue(of({ type: OUTPUT_TYPE.done, file: { response: { id: ITEM_ID } } }));
        const VALUES: any = {
          images: [UPLOAD_FILE, UPLOAD_FILE_2],
          category_id: '200',
        };
        service.createItem(VALUES, ITEM_TYPES.CONSUMER_GOODS).subscribe();

        expect(uploaderService.uploadFile).toHaveBeenCalledTimes(VALUES.images.length);
        expect(uploaderService.uploadFile).toHaveBeenLastCalledWith(UPLOAD_FILE_2, {
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '0',
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
          url: environment.baseUrl + 'api/v3/items/cars/' + CAR_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '0',
          },
          headers,
        });
      });
    });
    describe('normal item', () => {
      beforeEach(() => {
        spyOn(uploaderService, 'uploadFile');
      });
      it('should emit uploadFile event', () => {
        service.uploadSingleImage(UPLOAD_FILE, ITEM_ID, ITEM_TYPES.CONSUMER_GOODS);
        expect(uploaderService.uploadFile).toHaveBeenCalledWith(UPLOAD_FILE, {
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture2',
          method: 'POST',
          fieldName: 'image',
          data: {
            order: '0',
          },
          headers,
        });
      });
    });
  });

  describe('removeImage', () => {
    it('should emit uploadFile event', () => {
      spyOn(itemService, 'deletePicture');

      service.onDeleteImage('123', UPLOAD_FILE.id);

      expect(itemService.deletePicture).toHaveBeenCalledWith('123', UPLOAD_FILE.id);
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

      expect(itemService.updatePicturesOrder).toHaveBeenCalledWith('123', expectedOrder);
    });
  });
});
