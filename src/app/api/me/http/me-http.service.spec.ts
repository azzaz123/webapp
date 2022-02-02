import { TestBed } from '@angular/core/testing';

import { MeHttpService } from './me-http.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { publishedResponseFixture } from '@api/fixtures/catalog/published/published-response.fixtures';
import {
  BASE_SET_NOTIFICATION,
  ME_FAVOURITES_ENDPOINT,
  ME_SOLD_ITEMS_ENDPOINT,
  NOTIFICATIONS_API_URL_ENDPOINT,
} from '@api/me/http/endpoints';
import { FavouritesResponseDto } from '../dtos/favourites/response/favourites-response-dto';
import { SoldItemResponseDto } from '../dtos/sold/response/sold-response-dto';
import { soldItemsResponseFixture } from '@api/fixtures/me/sold/sold-response.fixture';
import { NotificationsSettingsResponseDto } from '../dtos/notifications-settings/response/notifcations-settings-response-dto';
import {
  notificationIdToModify,
  notificationsSettingsResponseFixture,
} from '@api/fixtures/me/notifications/notifications-response.fixture';

describe('MeHttpService', () => {
  let service: MeHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MeHttpService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(MeHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asked to retrieve favourites', () => {
    describe('with no pagination', () => {
      it('should retrieve favourites', () => {
        let response: FavouritesResponseDto;

        service.getFavourites().subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(ME_FAVOURITES_ENDPOINT);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve favourites', () => {
        let response: FavouritesResponseDto;

        service.getFavourites({ since: '10' }).subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(`${ME_FAVOURITES_ENDPOINT}?since=10`);
        req.flush(publishedResponseFixture);

        expect(response).toEqual(publishedResponseFixture);
      });
    });
  });

  describe('when asked to retrieve sold items', () => {
    describe('with no pagination', () => {
      it('should retrieve sold items', () => {
        let response: SoldItemResponseDto;

        service.getSoldItems().subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(ME_SOLD_ITEMS_ENDPOINT);
        req.flush(soldItemsResponseFixture);

        expect(response).toEqual(soldItemsResponseFixture);
      });
    });

    describe('with pagination', () => {
      it('should retrieve sold items', () => {
        let response: SoldItemResponseDto;

        service.getSoldItems({ since: '10' }).subscribe((res) => (response = res));

        const req: TestRequest = httpMock.expectOne(`${ME_SOLD_ITEMS_ENDPOINT}?since=10`);
        req.flush(soldItemsResponseFixture);

        expect(response).toEqual(soldItemsResponseFixture);
      });
    });
    describe('when asked to retrieve notifications settings', () => {
      describe('notifications settings', () => {
        it('should retrieve notifications settings', () => {
          let response: NotificationsSettingsResponseDto;
          service.getMyNotificationsSettings().subscribe((res) => (response = res));
          const req: TestRequest = httpMock.expectOne(`${NOTIFICATIONS_API_URL_ENDPOINT}`);
          req.flush(notificationsSettingsResponseFixture);
          expect(response).toEqual(notificationsSettingsResponseFixture);
        });

        it('should call disable notification', () => {
          service.setNotificationDisabled(notificationIdToModify).subscribe();
          const req: TestRequest = httpMock.expectOne(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/disable`);
          req.flush({});
          expect(req.request.url).toEqual(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/disable`);
          expect(req.request.method).toBe('POST');
        });

        it('should call enable notification', () => {
          service.setNotificationEnable(notificationIdToModify).subscribe();
          const req: TestRequest = httpMock.expectOne(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/enable`);
          req.flush({});
          expect(req.request.url).toEqual(`${BASE_SET_NOTIFICATION}/${notificationIdToModify}/enable`);
          expect(req.request.method).toBe('POST');
        });
      });
    });
  });
});
