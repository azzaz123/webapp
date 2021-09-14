import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { AD_SHOPPING_PUB_ID_WALLAPOP } from '@core/ads/constants';
import { AdsService } from '@core/ads/services';
import { CoreModule } from '@core/core.module';
import { moduleMetadata, Story } from '@storybook/angular';
import { AdSlotGroupShoppingComponent } from './ad-slot-group-shopping.component';

@Component({
  selector: 'stories-ad-slot-group-shopping',
  template:
    '<tsl-sky-slot-group-shopping [adShoppingPageOptions]="adShoppingPageOptions" [adSlotShoppingConfiguration]="adSlotShoppingConfiguration"></tsl-sky-slot-group-shopping>',
})
class StoyAdSlotGroupShoppingComponent extends AdSlotGroupShoppingComponent {
  constructor(adsService: AdsService) {
    super(adsService);
    adsService.init();
    adsService.setAdKeywords({ content: 'Iphone 11' });
  }
}

export default {
  title: 'WebApp/Shared/Ads/AdSlotShopping/Group',
  component: StoyAdSlotGroupShoppingComponent,
  decorators: [
    moduleMetadata({
      declarations: [StoyAdSlotGroupShoppingComponent, AdSlotGroupShoppingComponent],
      imports: [CoreModule, HttpClientModule],
    }),
  ],
};

const Template: Story<StoyAdSlotGroupShoppingComponent> = (args: StoyAdSlotGroupShoppingComponent) => ({
  component: StoyAdSlotGroupShoppingComponent,
  props: args,
  template:
    '<stories-ad-slot-group-shopping [adSlotShoppingConfiguration]="adSlotShoppingConfiguration" [adShoppingPageOptions]="adShoppingPageOptions"></stories-ad-slot-group-shopping>',
});

export const Default = Template.bind({});

Default.args = {
  adShoppingPageOptions: {
    pubId: AD_SHOPPING_PUB_ID_WALLAPOP,
    priceCurrency: 'EUR',
    adsafe: 'medium',
    adtest: 'off',
    channel: 'searchpage',
    hl: 'es',
    adLoadedCallback: () => {},
  },
  adSlotShoppingConfiguration: {
    slotId: 'afshcontainer',
    container: 'afshcontainer',
    width: 500,
    height: 400,
  },
};
