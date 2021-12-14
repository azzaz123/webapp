import { AdSlotGroupShoppingDirective } from './ad-slot-group-shopping.directive';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { AdSlotGroupShoppingComponentStub } from '@fixtures/shared/components/ad-slot-group-shopping.component.stub';

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
    const adSlotGroupShoppingComponent = new AdSlotGroupShoppingComponentStub();
    adSlotGroupShoppingComponent.adShoppingPageOptions = pageOptions;
    adSlotGroupShoppingComponent.adSlotShoppingConfiguration = slotConfig1;
    const directive = new AdSlotGroupShoppingDirective(adSlotGroupShoppingComponent, adsServiceMock);

    directive.ngAfterContentInit();

    expect(adsServiceMock.setShoppingSlots).toHaveBeenCalledTimes(1);
    expect(adsServiceMock.setShoppingSlots).toHaveBeenCalledWith({ pageOptions, slotConfig: [slotConfig1] });
  });
});
