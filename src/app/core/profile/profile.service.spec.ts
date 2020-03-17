/* tslint:disable:no-unused-variable */

import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ProfileService } from './profile.service';
import { HttpService } from '../http/http.service';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions } from '@angular/http';
import { HaversineService } from 'ng2-haversine';
import { I18nService } from '../i18n/i18n.service';
import { EventService } from '../event/event.service';
import { Profile } from './profile';
import { CookieService } from 'ngx-cookie';
import { NgxPermissionsService } from 'ngx-permissions';
import {
  PROFILE_DATA, PROFILE_ID, PROFILE_IMAGE, NUM_TOTAL_ITEMS,
  FAVORITED, MICRO_NAME, SCORING_STARS, MOCK_PROFILE, IS_PROFESSIONAL, SCREEN_NAME
} from '../../../tests/profile.fixtures.spec';
import { TEST_HTTP_PROVIDERS } from '../../../tests/utils.spec';
import { environment } from '../../../environments/environment';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FAVORITES_USER_MOCK } from '../../../tests/favorites.fixtures';

describe('Service: Profile', () => {

  let service: ProfileService;
  let mockBackend: MockBackend;
  let http: HttpService;
  let event: EventService;
  let cookieService: CookieService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ...TEST_HTTP_PROVIDERS,
        EventService,
        I18nService,
        HaversineService,
        ProfileService,
        {
          provide: 'SUBDOMAIN', useValue: 'www'
        },
        {
          provide: CookieService,
          useValue: {
            cookies: {},
            put(key, value) {
              this.cookies[key] = value;
            },
            remove(key) {
              delete this.cookies[key];
            }
          }
        },
        {
          provide: NgxPermissionsService,
          useValue: {
            addPermission() {},
            flushPermissions() {},
            hasPermission() {}
          }
        }
      ]
    });
    service = TestBed.get(ProfileService);
    mockBackend = TestBed.get(MockBackend);
    http = TestBed.get(HttpService);
    event = TestBed.get(EventService);
    cookieService = TestBed.get(CookieService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return the profile', () => {
    const profile: Profile = new Profile(PROFILE_ID, [PROFILE_IMAGE], MICRO_NAME, NUM_TOTAL_ITEMS, SCORING_STARS,
      PROFILE_IMAGE, FAVORITED, IS_PROFESSIONAL, SCREEN_NAME);
    service['_profile'] = profile;
    expect(service.profile).toBe(profile);
  });

  describe('get', () => {
    describe('without backend error', () => {
      beforeEach(fakeAsync(() => {
        mockBackend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toBe(environment.baseUrl + 'api/v3/users/' + PROFILE_ID);
          const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(PROFILE_DATA)});
          connection.mockRespond(new Response(res));
        });
      }));

      it('should return the Profile object', fakeAsync(() => {
        let profile: Profile;
        service.get(PROFILE_ID).subscribe((r: Profile) => {
          profile = r;
        });

        expect(profile instanceof Profile).toBeTruthy();
        expect(profile).toEqual(MOCK_PROFILE);
      }));
    });
  });

  describe('favoriteItem', () => {
    it('should PUT favourite', () => {
      const USER_ID = 'user-id';
      const FAVOURITE = true;

      service.favoriteItem(USER_ID, FAVOURITE).subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}api/v3/users/${USER_ID}/favorite`);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.body).toEqual({ favorited: FAVOURITE });
    });
  });

  describe('myFavorites', () => {
    it('should GET favourites', () => {
      const INIT = 0;

      service.myFavorites(INIT).subscribe();

      const req = httpTestingController.expectOne(
        `${environment.baseUrl}api/v3/users/me/users/favorites?init=${INIT}`);
      req.flush(FAVORITES_USER_MOCK);
      expect(req.request.method).toEqual('GET');
      expect(req.request.params.get('init')).toEqual(INIT.toString());
    });
  });

});
