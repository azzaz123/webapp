import { MOCK_CRITEO } from './../../../../../configs/jest/global-mocks.fixtures.spec';
import { TestBed } from '@angular/core/testing';

import { CriteoService } from './criteo.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { AD_SLOT_NETWORK_ID } from '@core/ads/constants';

describe('CriteoService', () => {
  let service: CriteoService;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      Criteo: MOCK_CRITEO,
    };
    TestBed.configureTestingModule({
      providers: [
        CriteoService,
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
      ],
    });
    service = TestBed.inject(CriteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when requesting bids', () => {
    it('should request bids to criteo', () => {
      spyOn(windowMock.Criteo, 'RequestBidsOnGoogleTagSlots').and.callThrough();

      service.requestBid().subscribe();

      expect(
        windowMock.Criteo.RequestBidsOnGoogleTagSlots
      ).toHaveBeenCalledWith(AD_SLOT_NETWORK_ID, jasmine.any(Function), 1000);
    });

    it('should set DFPKeyValues targeting', () => {
      spyOn(windowMock.Criteo, 'RequestBidsOnGoogleTagSlots').and.callThrough();
      spyOn(windowMock.Criteo, 'SetDFPKeyValueTargeting').and.callThrough();

      service.requestBid().subscribe();

      expect(windowMock.Criteo.SetDFPKeyValueTargeting).toBeCalledTimes(1);
    });
  });
});
