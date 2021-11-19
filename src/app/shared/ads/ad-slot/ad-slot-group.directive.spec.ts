import { AdSlotGroupDirective } from './ad-slot-group.directive';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { of } from 'rxjs/internal/observable/of';
import { QueryList } from '@angular/core';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';
import { ExperimentationService } from '@core/experimentation/services/experimentation/experimentation.service';

const adSlot1: AdSlotConfiguration = {
  id: 'slot-1',
  name: 'slot-1',
  device: [],
  networkId: 0,
  sizes: [],
  type: 'search',
};

const adSlot2: AdSlotConfiguration = {
  id: 'slot-2',
  name: 'slot-2',
  device: [],
  networkId: 0,
  sizes: [],
  type: 'search/baseline',
};

const adSlot3: AdSlotConfiguration = {
  id: 'slot-3',
  name: 'slot-3',
  device: [],
  networkId: 0,
  sizes: [],
  type: 'search/variant',
};

describe('AdSlotGroupDirective', () => {
  const adsServiceMock: AdsService = {
    setSlots: () => {},
    setAdKeywords: () => {},
    setTargetingByAdsKeywords: () => {},
  } as unknown as AdsService;

  const experimentationServiceMock: ExperimentationService = {
    getOptimizeVariant: () => {},
    experimentReady$: of(true),
  } as unknown as ExperimentationService;

  it('should set correct slots when variant is Baseline and ask for display on the first one', () => {
    spyOn(adsServiceMock, 'setSlots');
    spyOn(experimentationServiceMock, 'getOptimizeVariant').and.returnValue('Baseline');

    const directive = new AdSlotGroupDirective(adsServiceMock, experimentationServiceMock);
    directive.slotsQuery = {
      changes: of([{ adSlot: adSlot1 }, { adSlot: adSlot2 }, { adSlot: adSlot3 }]),
    } as unknown as QueryList<AdSlotComponent>;

    directive.ngAfterContentInit();

    expect(adsServiceMock.setSlots).toHaveBeenCalledTimes(1);
    expect(adsServiceMock.setSlots).toHaveBeenCalledWith([adSlot1, adSlot2]);
  });

  it('should set correct slots when variant is Variant and ask for display on the first one', () => {
    spyOn(adsServiceMock, 'setSlots');
    spyOn(experimentationServiceMock, 'getOptimizeVariant').and.returnValue('Variant');

    const directive = new AdSlotGroupDirective(adsServiceMock, experimentationServiceMock);
    directive.slotsQuery = {
      changes: of([{ adSlot: adSlot1 }, { adSlot: adSlot2 }, { adSlot: adSlot3 }]),
    } as unknown as QueryList<AdSlotComponent>;

    directive.ngAfterContentInit();

    expect(adsServiceMock.setSlots).toHaveBeenCalledTimes(1);
    expect(adsServiceMock.setSlots).toHaveBeenCalledWith([adSlot1, adSlot3]);
  });
});
