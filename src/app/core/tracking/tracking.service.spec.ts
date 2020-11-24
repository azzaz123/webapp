import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie';

import { environment } from '../../../environments/environment';
import { UserService } from '../user/user.service';
import { MockedUserService } from '../../../tests/user.fixtures.spec';
import { EventService } from '../event/event.service';

import { TrackingService } from './tracking.service';
import { NavigatorService } from './navigator.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

class MockedNavigatorService {
  get browserName() {
    return 'Chrome';
  }

  get fullVersion() {
    return 'Chrome 55';
  }

  get operativeSystem() {
    return 'Windows';
  }
}

describe('Service: Tracking', () => {
  let service: TrackingService;
  let eventService: EventService;
  let userService: UserService;
  let navigatorService: NavigatorService;
  let cookieService: CookieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: UserService,
          useClass: MockedUserService,
        },
        {
          provide: CookieService,
          useValue: {
            put(key, value) {},
            get(key) {
              return 'a-b-c';
            },
          },
        },
        { provide: NavigatorService, useClass: MockedNavigatorService },
        TrackingService,
        EventService,
      ],
    });
    eventService = TestBed.inject(EventService);
    spyOn(eventService, 'subscribe').and.callThrough();
    service = TestBed.inject(TrackingService);
    userService = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
    navigatorService = TestBed.inject(NavigatorService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('track', () => {
    it('should send event to server', () => {
      service.track(TrackingService.NOTIFICATION_RECEIVED, {
        conversation_id: 'conversation',
      });

      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toBeTruthy(); // ideally would be expectedSendEvent, but this service is going to be deprecated
    });

    it('should send professional flag when user is professional', () => {
      const expectedAttributes = JSON.stringify({
        conversation_id: 'conversation',
        professional: true,
      });
      jest
        .spyOn(userService, 'user', 'get')
        .mockReturnValue({ type: 'professional' } as any);

      service.track(TrackingService.NOTIFICATION_RECEIVED, {
        conversation_id: 'conversation',
      });
      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain(expectedAttributes);
    });

    it('should not send professional flag when user is not professional', () => {
      const expectedAttributes = JSON.stringify({
        conversation_id: 'conversation',
      });
      jest
        .spyOn(userService, 'user', 'get')
        .mockReturnValue({ type: 'normal' } as any);

      service.track(TrackingService.NOTIFICATION_RECEIVED, {
        conversation_id: 'conversation',
      });
      const req = httpMock.expectOne(environment.clickStreamURL);
      req.flush({});

      expect(req.request.method).toBe('POST');
      expect(req.request.body).toContain(expectedAttributes);
    });
  });
});
