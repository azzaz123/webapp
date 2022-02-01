import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { MOCK_ACCEPT_SCREEN_PROPERTIES } from '@fixtures/private/delivery/accept-screen/accept-screen-properties.fixtures.spec';
import { Observable, of } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenService } from '../accept-screen/accept-screen.service';

import { AcceptScreenStoreService } from './accept-screen-store.service';

describe('AcceptScreenStoreService', () => {
  const MOCK_REQUEST_ID: string = '2387283dsbd';
  let service: AcceptScreenStoreService;
  let acceptScreenService: AcceptScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AcceptScreenStoreService,
        {
          provide: AcceptScreenService,
          useValue: {
            getAcceptScreenProperties(): Observable<AcceptScreenProperties> {
              return of(MOCK_ACCEPT_SCREEN_PROPERTIES);
            },
          },
        },
      ],
    });
    service = TestBed.inject(AcceptScreenStoreService);
    acceptScreenService = TestBed.inject(AcceptScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when we initialize the accept screen store', () => {
    let expectedAcceptScreenProperties: AcceptScreenProperties;

    beforeEach(fakeAsync(() => {
      spyOn(acceptScreenService, 'getAcceptScreenProperties').and.callThrough();
      service.properties$.subscribe((newProperties: AcceptScreenProperties) => {
        expectedAcceptScreenProperties = newProperties;
      });

      service.initialize(MOCK_REQUEST_ID);
      tick();
    }));

    it('should request the accept screen properties', () => {
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledTimes(1);
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should update the accept screen store properties ', () => {
      expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
    });
  });

  describe('when we update the accept screen store', () => {
    let expectedAcceptScreenProperties: AcceptScreenProperties;

    beforeEach(fakeAsync(() => {
      spyOn(acceptScreenService, 'getAcceptScreenProperties').and.callThrough();
      service.properties$.subscribe((newProperties: AcceptScreenProperties) => {
        expectedAcceptScreenProperties = newProperties;
      });

      service.update(MOCK_REQUEST_ID);
      tick();
    }));

    it('should request the accept screen properties', () => {
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledTimes(1);
      expect(acceptScreenService.getAcceptScreenProperties).toHaveBeenCalledWith(MOCK_REQUEST_ID);
    });

    it('should update the accept screen store properties ', () => {
      expect(expectedAcceptScreenProperties).toStrictEqual(MOCK_ACCEPT_SCREEN_PROPERTIES);
    });
  });
});
