import { MOCK_APSTAG } from './../../../../../configs/jest/global-mocks.fixtures.spec';
import { TestBed } from '@angular/core/testing';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { MockAdSlots } from '@fixtures/ads.fixtures.spec';

import { AmazonPublisherServiceMapper } from './amazon-publisher-service.model';

import { AmazonPublisherService } from './amazon-publisher.service';

describe('AmazonPublisherService', () => {
  let service: AmazonPublisherService;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      apstag: MOCK_APSTAG,
    };
    TestBed.configureTestingModule({
      providers: [
        AmazonPublisherService,
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });
    service = TestBed.inject(AmazonPublisherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting bids', () => {
    it('should fetch bids with configuration', () => {
      spyOn(windowMock.apstag, 'fetchBids').and.callThrough();

      service.requestBid(MockAdSlots).subscribe();

      expect(windowMock.apstag.fetchBids).toHaveBeenCalledWith(
        {
          slots: AmazonPublisherServiceMapper(MockAdSlots),
          timeout: AmazonPublisherService.bidTimeout,
        },
        jasmine.any(Function)
      );
    });
  });

  describe('when we check if library is defined or not', () => {
    it('should do nothing is not defined', () => {
      windowMock.apstag = null;

      const isDefined: boolean = service.isLibraryRefDefined();

      expect(isDefined).toBe(false);
    });

    it('should set initialize configuration if is defined', () => {
      spyOn(windowMock.apstag, 'init').and.callThrough();

      const isDefined: boolean = service.isLibraryRefDefined();

      expect(windowMock.apstag.init).toHaveBeenCalledWith({
        pubID: '3703',
        adServer: 'googletag',
        gdpr: {
          cmpTimeout: 1000,
        },
      });
    });
  });
});
