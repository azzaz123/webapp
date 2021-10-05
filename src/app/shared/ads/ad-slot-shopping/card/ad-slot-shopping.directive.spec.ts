import { QueryList } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { AdSlotShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { of } from 'rxjs';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';
import { AdSlotShoppingDirective } from './ad-slot-shopping.directive';

const adSlot1: AdSlotShoppingConfiguration = {
  container: 'slot-container-1',
  styleId: '8537702058',
  linkTarget: '_blank',
};

const adSlot2: AdSlotShoppingConfiguration = {
  container: 'slot-container-2',
  styleId: '8537702058',
  linkTarget: '_blank',
};

const adSlot3: AdSlotShoppingConfiguration = {
  container: 'slot-container-3',
  styleId: '8537702058',
  linkTarget: '_blank',
};

const adShoppingNativeListPageOptionsMock = {
  pubId: '000',
  priceCurrency: 'euro',
  adsafe: 'adsafe-test',
  adtest: 'adtest-test',
  channel: 'channel-test',
  hl: 'hl-test',
  adLoadedCallback: () => {},
};

class mockAdSlotShoppingComponent {
  public adSlotLoaded: boolean;
  public adSlotShoppingConfiguration: AdSlotShoppingConfiguration;

  constructor(loaded: boolean, config: AdSlotShoppingConfiguration) {
    this.adSlotLoaded = loaded;
    this.adSlotShoppingConfiguration = config;
  }
}

describe('AdSlotShoppingDirective', () => {
  let adsServiceMock: AdsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        providers: [
          {
            provide: AdsService,
            useValue: {
              displayAdShopping: () => {},
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    adsServiceMock = TestBed.inject(AdsService);
  });

  it('should call display on not loaded ad slots', () => {
    spyOn(adsServiceMock, 'displayAdShopping');

    const directive = new AdSlotShoppingDirective(adsServiceMock);
    directive.adShoppingNativeListPageOptions = adShoppingNativeListPageOptionsMock;

    directive.slotsQuery = {
      changes: of([
        new mockAdSlotShoppingComponent(true, adSlot1),
        new mockAdSlotShoppingComponent(false, adSlot2),
        new mockAdSlotShoppingComponent(false, adSlot3),
      ]),
    } as QueryList<AdSlotShoppingComponent>;
    directive.ngAfterViewInit();

    expect(adsServiceMock.displayAdShopping).toHaveBeenCalledWith(adShoppingNativeListPageOptionsMock, [adSlot2, adSlot3]);
  });
});
