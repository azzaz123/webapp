import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AD_SHOPPING_PUB_ID_WALLAPOP } from '@core/ads/constants';
import { AdsService } from '@core/ads/services';
import { CoreModule } from '@core/core.module';
import { DeviceService } from '@core/device/device.service';
import { moduleMetadata, Story } from '@storybook/angular';
import { AdSlotShoppingComponent } from './ad-slot-shopping.component';
import { CARD_TYPES } from '@public/shared/components/item-card-list/enums/card-types.enum';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'stories-ad-slot-shopping',
  template:
    '<tsl-sky-shopping [cardType]="cardType" [adSlotContainer]="adSlotContainer" [adShoppingPageOptions]="adShoppingPageOptions" [index]="index"></tsl-sky-shopping>',
})
class StoryAdSlotShoppingComponent extends AdSlotShoppingComponent {
  constructor(adsService: AdsService, deviceService: DeviceService) {
    super(adsService, deviceService);
    adsService.init();
    adsService.setAdKeywords({ content: 'Iphone 11' });
  }
}

export default {
  title: 'WebApp/Shared/Ads/AdSlotShopping/Native',
  component: StoryAdSlotShoppingComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoryAdSlotShoppingComponent, AdSlotShoppingComponent],
      imports: [CoreModule, HttpClientModule],
    }),
  ],
};

const Template: Story<StoryAdSlotShoppingComponent> = (args: StoryAdSlotShoppingComponent) => ({
  component: StoryAdSlotShoppingComponent,
  props: args,
  template:
    '<stories-ad-slot-shopping [cardType]="cardType" [adSlotContainer]="adSlotContainer" [adShoppingPageOptions]="adShoppingPageOptions" [index]="index"></stories-ad-slot-shopping>',
});

export const Default = Template.bind({});

Default.args = {
  cardType: CARD_TYPES.REGULAR,
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
  cardType: CARD_TYPES.WIDE,
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
