import { AdSlotGroupDirective } from './ad-slot-group.directive';
import { AdSlotConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { of } from 'rxjs/internal/observable/of';
import { QueryList } from '@angular/core';
import { AdSlotComponent } from '@shared/ads/ad-slot/ad-slot.component';

const adSlot1: AdSlotConfiguration = {
  id: 'slot-1',
  name: 'slot-1',
  device: [],
  networkId: 0,
  sizes: [],
};

const adSlot2: AdSlotConfiguration = {
  id: 'slot-2',
  name: 'slot-2',
  device: [],
  networkId: 0,
  sizes: [],
};

describe('AdSlotGroupDirective', () => {
  const adsServiceMock: AdsService = ({ setSlots: () => {} } as unknown) as AdsService;

  it('should set all slots and ask for display on the first one', () => {
    spyOn(adsServiceMock, 'setSlots');

    const directive = new AdSlotGroupDirective(adsServiceMock);
    directive.slotsQuery = ({ changes: of([{ adSlot: adSlot1 }, { adSlot: adSlot2 }]) } as unknown) as QueryList<AdSlotComponent>;

    directive.ngAfterContentInit();

    expect(adsServiceMock.setSlots).toHaveBeenCalledTimes(1);
    expect(adsServiceMock.setSlots).toHaveBeenCalledWith([adSlot1, adSlot2]);
  });
});
