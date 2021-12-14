import { AdSlotGroupShoppingDirective } from './ad-slot-group-shopping.directive';
import { AdShoppingPageOptions, AdSlotConfiguration, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { of } from 'rxjs/internal/observable/of';
import { QueryList } from '@angular/core';
import { AdSlotGroupShoppingComponent } from './ad-slot-group-shopping.component';

const slotConfig1: AdSlotGroupShoppingConfiguration = {
  slotId: 'test',
  width: 100,
  height: 100,
  container: 'containerTest',
};

const pageOptions: AdShoppingPageOptions = {
  pubId: '000',
  priceCurrency: 'euro',
  adsafe: 'safe',
  adtest: 'test',
  channel: 'channel',
  hl: 'hlTest',
  adLoadedCallback: () => {},
};

describe('AdSlotGroupShoppingDirective', () => {
  const adsServiceMock: AdsService = {
    setShoppingSlots: () => {},
  } as unknown as AdsService;

  it('should set correct slots', () => {
    spyOn(adsServiceMock, 'setShoppingSlots');

    const directive = new AdSlotGroupShoppingDirective(adsServiceMock);
    directive.slotsQuery = {
      changes: of([{ adShoppingPageOptions: pageOptions, adSlotShoppingConfiguration: slotConfig1 }]),
    } as unknown as QueryList<AdSlotGroupShoppingComponent>;

    directive.ngAfterContentInit();

    expect(adsServiceMock.setShoppingSlots).toHaveBeenCalledTimes(1);
    expect(adsServiceMock.setShoppingSlots).toHaveBeenCalledWith({ pageOptions, slotConfig: [slotConfig1] });
  });
});
