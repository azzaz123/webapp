import { TestBed, inject } from '@angular/core/testing';
import { UploadFile, UploadInput } from 'ngx-uploader';
import { UploadService } from './upload.service';
import { TEST_HTTP_PROVIDERS, AccessTokenService, HttpService, ITEM_ID } from 'shield';
import { environment } from '../../../../environments/environment';
import { CAR_ID, UPLOAD_FILE, UPLOAD_FILE_ID } from '../../../../tests/upload.fixtures';
import { UserService } from '../../../core/user/user.service';
import { USER_LOCATION_COORDINATES } from '../../../../tests/user.fixtures';

describe('UploadService', () => {

  let service: UploadService;
  let response: UploadInput;
  let accessTokenService: AccessTokenService;
  let http: HttpService;
  let userService: UserService;

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
        },
        {
          provide: UserService, useValue: {
          user: {}
        }
        }
      ]
    });
    service = TestBed.get(UploadService);
    accessTokenService = TestBed.get(AccessTokenService);
    http = TestBed.get(HttpService);
    userService = TestBed.get(UserService);
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
        expect(appendSpy).not.toHaveBeenCalled();
      });
      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '100',
          location: USER_LOCATION_COORDINATES
        };
        beforeEach(() => {
          service.createItemWithFirstImage(VALUES, UPLOAD_FILE);
        });
        it('should update user location', () => {
          expect(userService.user.location).toEqual({
            id: 1,
            approximated_latitude: USER_LOCATION_COORDINATES.latitude,
            approximated_longitude: USER_LOCATION_COORDINATES.longitude,
            city: USER_LOCATION_COORDINATES.name,
            zip: '12345',
            approxRadius: 1
          });
          expect(response.data.item_car).toEqual(new Blob([JSON.stringify(VALUES)]));
          expect(appendSpy).toHaveBeenCalledWith('X-LocationLatitude', USER_LOCATION_COORDINATES.latitude.toString());
          expect(appendSpy).toHaveBeenCalledWith('X-LocationLongitude', USER_LOCATION_COORDINATES.longitude.toString());
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
      describe('with user location', () => {
        const VALUES: any = {
          test: 'hola',
          hola: 'hey',
          category_id: '200',
          location: USER_LOCATION_COORDINATES
        };
        beforeEach(() => {
          service.createItemWithFirstImage(VALUES, UPLOAD_FILE);
        });
        it('should update user location', () => {
          expect(userService.user.location).toEqual({
            id: 1,
            approximated_latitude: USER_LOCATION_COORDINATES.latitude,
            approximated_longitude: USER_LOCATION_COORDINATES.longitude,
            city: USER_LOCATION_COORDINATES.name,
            zip: '12345',
            approxRadius: 1
          });
          expect(response.data.item).toEqual(new Blob([JSON.stringify(VALUES)]));
          expect(appendSpy).toHaveBeenCalledWith('X-LocationLatitude', USER_LOCATION_COORDINATES.latitude.toString());
          expect(appendSpy).toHaveBeenCalledWith('X-LocationLongitude', USER_LOCATION_COORDINATES.longitude.toString());
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
        service.uploadOtherImages(ITEM_ID, '');
        expect(response).toEqual({
          type: 'uploadAll',
          url: environment.baseUrl + 'api/v3/items/' + ITEM_ID + '/picture',
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
