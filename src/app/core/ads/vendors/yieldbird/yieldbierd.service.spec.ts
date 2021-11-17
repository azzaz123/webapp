import { TestBed } from '@angular/core/testing';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsKeywordsService } from '@core/ads/services/ads-keywords/ads-keywords.service';
import { DeviceService } from '@core/device/device.service';
import { DeviceType } from '@core/device/deviceType.enum';
import { WINDOW_TOKEN } from '@core/window/window.token';
import {
  MockAdShoppingPageOptions,
  MockAdsKeywords,
  MockAdsKeywordsService,
  MockAdSlots,
  MockAdSlotShopping,
} from '@fixtures/ads.fixtures.spec';
import { random } from 'faker';
import { MOCK_GOOGLE_TAG } from './../../../../../configs/jest/global-mocks.fixtures.spec';
import { YieldBirdService } from './yieldbird.service';

describe('YieldBirdService', () => {
  let service: YieldBirdService;
  let windowMock;

  beforeEach(() => {
    windowMock = {
      googletag: MOCK_GOOGLE_TAG,
    };

    TestBed.configureTestingModule({
      providers: [
        YieldBirdService,
        {
          provide: WINDOW_TOKEN,
          useValue: windowMock,
        },
        {
          provide: AdsKeywordsService,
          useValue: MockAdsKeywordsService,
        },
      ],
    });
    service = TestBed.inject(YieldBirdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
