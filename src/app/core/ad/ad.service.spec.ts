import {
  TestBed,
  fakeAsync,
  tick,
  discardPeriodicTasks
} from '@angular/core/testing';
import { AdService } from './ad.service';
import { TEST_HTTP_PROVIDERS, HttpService } from 'shield';
import { ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

let service: AdService;
let http: HttpService;
let mockBackend: MockBackend;
describe('AdService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdService,
        ...TEST_HTTP_PROVIDERS
      ]
    });

    service = TestBed.get(AdService);
    http = TestBed.get(HttpService);
    mockBackend = TestBed.get(MockBackend);
  });

  describe ('getRefreshRate', () => {
    it('should refresh ads with its rate' , fakeAsync(() => {
      const refreshRate = 1000;
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: refreshRate});
        connection.mockRespond(new Response(res));
      });
      const numberOfTimes = 2;
      let timesCalled = 0 ;

      service.getRefreshRate().subscribe(() => {
        timesCalled++;
      });
      tick(numberOfTimes * refreshRate);

      expect(timesCalled).toEqual(numberOfTimes);
      discardPeriodicTasks();
    }));

    it('when not receiving refresh rate, should not refresh', fakeAsync(() => {
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: 0});
        connection.mockRespond(new Response(res));
      });
      let refreshed = false;

      service.getRefreshRate().subscribe(() => {
        refreshed = true;
      });

      tick(2000);
      expect(refreshed).toBeFalsy();
      discardPeriodicTasks();
    }))
  })
});
