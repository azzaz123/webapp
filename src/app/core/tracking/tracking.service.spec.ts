/* tslint:disable:no-unused-variable */

import { TestBed } from '@angular/core/testing';
import { TrackingService } from './tracking.service';
import { HttpService, NavigatorService, TEST_HTTP_PROVIDERS, WindowRef } from 'shield';
import { Observable } from 'rxjs/Observable';
import { RouterTestingModule } from '@angular/router/testing';
import { UserService } from '../user/user.service';
import { environment } from '../../../environments/environment';

let service: TrackingService;

let http: HttpService;
let window: any;

class MockedNavigatorService {
  private parseVersionInfo() {
  }

  private setOperativeSystem() {
  }

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
  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UserService, useValue: {
          user: {
            id: 'userId'
          }
        }
        },
        {
          provide: WindowRef, useValue: {
          nativeWindow: {
            screen: {
              width: 1366,
              height: 768
            },
            locale: 'es'
          }
        }
        },
        {provide: NavigatorService, useClass: MockedNavigatorService},
        TEST_HTTP_PROVIDERS,
        TrackingService
      ]
    });
    service = TestBed.get(TrackingService);
    http = TestBed.get(HttpService);
    window = TestBed.get(WindowRef).nativeWindow;
  });
  describe('track', () => {
    it('should call createNewEvent with passing the given arguments', () => {
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      service.track(TrackingService.MESSAGE_NOTIFIED, {conversation_id: 'conversation'});
      expect((service as any).createNewEvent).toHaveBeenCalledWith(TrackingService.MESSAGE_NOTIFIED,
        {conversation_id: 'conversation'});
    });
    it('should do a post to the PRO clickstream if the environment is production', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      environment.production = true;
      service.track(TrackingService.MESSAGE_NOTIFIED, {conversation_id: 'conversation'});
      expect(http.postNoBase['calls'].argsFor(0)[0]).toBe(service['proClickStreamURL']);
    });
    it('should do a post to the PRE clickstream if the environment is not production', () => {
      spyOn(http, 'postNoBase').and.returnValue(Observable.of({}));
      spyOn<any>(service, 'createNewEvent').and.callThrough();
      environment.production = false;
      service.track(TrackingService.MESSAGE_NOTIFIED, {conversation_id: 'conversation'});
      expect(http.postNoBase['calls'].argsFor(0)[0]).toBe(service['preClickStreamURL']);
    });
  });

});
