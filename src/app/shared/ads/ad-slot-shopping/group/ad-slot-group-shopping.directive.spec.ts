import { AdSlotGroupShoppingDirective } from './ad-slot-group-shopping.directive';
import { AdShoppingPageOptions, AdSlotGroupShoppingConfiguration } from '@core/ads/models';
import { AdsService } from '@core/ads/services';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

@Component({
  template: `<div
    tslAdSlotGroupShopping
    [id]="adSlotShoppingConfiguration.container"
    [adSlotShoppingConfiguration]="adSlotShoppingConfiguration"
    [adShoppingPageOptions]="adShoppingPageOptions"
  ></div>`,
})
class TestComponent {
  adSlotShoppingConfiguration: AdSlotGroupShoppingConfiguration;
  adShoppingPageOptions: AdShoppingPageOptions;
}

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
  let fixture: ComponentFixture<TestComponent>;
  let component: TestComponent;
  let adsService: AdsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [AdSlotGroupShoppingDirective, TestComponent],
        providers: [
          {
            provide: AdsService,
            useValue: {
              setShoppingSlots() {},
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    adsService = TestBed.inject(AdsService);
  });

  it('should set correct slots', () => {
    spyOn(adsService, 'setShoppingSlots');
    component.adSlotShoppingConfiguration = slotConfig1;
    component.adShoppingPageOptions = pageOptions;

    fixture.detectChanges();

    expect(adsService.setShoppingSlots).toHaveBeenCalledTimes(1);
    expect(adsService.setShoppingSlots).toHaveBeenCalledWith({ pageOptions, slotConfig: [slotConfig1] });
  });
});
