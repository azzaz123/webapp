import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AD_SHOPPING_PUB_ID_WALLAPOP } from '@core/ads/constants';
import { AdsService } from '@core/ads/services';
import { CoreModule } from '@core/core.module';
import { DeviceService } from '@core/device/device.service';
import { moduleMetadata, Story } from '@storybook/angular';
import { Observable } from 'rxjs';
import { AdSlotNativeShoppingComponent } from './ad-slot-native-shopping.component';

@Component({
  selector: 'stories-ad-slot-shopping',
  template:
    '<tsl-sky-native-shopping *ngIf="isReady$ | async" [isWide]="isWide" [adSlotContainer]="adSlotContainer" [adShoppingPageOptions]="adShoppingPageOptions" [index]="index"></tsl-sky-native-shopping>',
})
class StoryAdSlotShoppingComponent extends AdSlotNativeShoppingComponent {
  isReady$: Observable<boolean>;

  constructor(adsService: AdsService, deviceService: DeviceService) {
    super(adsService, deviceService);
    adsService.init();
    this.isReady$ = adsService.adsReady$;
    adsService.setAdKeywords({ content: 'Iphone 11' });
  }
}

export default {
  title: 'WebApp/Shared/Ads/AdSlotShopping/Native',
  component: StoryAdSlotShoppingComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryAdSlotShoppingComponent, AdSlotNativeShoppingComponent],
      providers: [{ provide: 'SUBDOMAIN', useValue: 'www' }],
      imports: [CoreModule, CommonModule, HttpClientModule],
    }),
  ],
};

const Template: Story<StoryAdSlotShoppingComponent> = (args: StoryAdSlotShoppingComponent) => ({
  component: StoryAdSlotShoppingComponent,
  props: args,
  template:
    '<stories-ad-slot-shopping [isWide]="isWide" [adSlotContainer]="adSlotContainer" [adShoppingPageOptions]="adShoppingPageOptions" [index]="index"></stories-ad-slot-shopping>',
});

export const Default = Template.bind({});

Default.args = {
  isWide: false,
  index: 9,
  adSlotContainer: 'div-gpt-ad-1536058445169',
  adShoppingPageOptions: {
    pubId: AD_SHOPPING_PUB_ID_WALLAPOP,
    priceCurrency: 'EUR',
    adsafe: 'medium',
    adtest: 'off',
    channel: 'searchpgeintegWEB',
    hl: 'es',
    adLoadedCallback: () => {},
  },
};

export const Wide = Template.bind({});

Wide.args = {
  isWide: true,
  index: 1,
  adSlotContainer: 'div-gpt-ad-1536058445169',
  adShoppingPageOptions: {
    pubId: AD_SHOPPING_PUB_ID_WALLAPOP,
    priceCurrency: 'EUR',
    adsafe: 'medium',
    adtest: 'off',
    channel: 'searchpgeintegWEB',
    hl: 'es',
    adLoadedCallback: () => {},
  },
};
