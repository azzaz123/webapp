import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SlidesCarouselModule } from '../carousel-slides/carousel-slides.module';
import { ItemExtraInfoModule } from '../item-extra-info/item-extra-info.module';
import { ItemWideCardComponent } from './item-wide-card.component';
import {
  MOCK_ITEM,
  MOCK_ITEM_BUMPED,
  MOCK_ITEM_COUNTRY_BUMPED,
  MOCK_ITEM_FAVOURITE,
  MOCK_ITEM_RESERVED,
  MOCK_ITEM_SOLD,
  MOCK_ITEM_WITHOUT_IMAGES,
} from './item-wide-card.mock.stories';

export default {
  title: 'Webapp/Public/Shared/Components/ItemWideCard',
  component: ItemWideCardComponent,
} as Meta;

const Template: Story<ItemWideCardComponent> = (args: ItemWideCardComponent) => ({
  component: ItemWideCardComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemWideCardComponent],
    imports: [
      CommonModule,
      FavouriteIconModule,
      CustomCurrencyModule,
      SvgIconModule,
      SlidesCarouselModule,
      ItemExtraInfoModule,
      HttpClientModule,
      HammerModule,
    ],
    providers: [DeviceDetectorService, HAMMER_PROVIDER],
  },
  template:
    '<tsl-item-wide-card [item]="item" [showFavourite]="showFavourite" [itemExtraInfo]="itemExtraInfo" (toggleFavourite)="toggleFavourite()"></tsl-item-wide-card>',
});

const MOCK_ITEM_EXTRA_INFO = ['Cámara De Fotos', '20 cm', 'Digital'];

export const DefaultMD = Template.bind({});
DefaultMD.args = {
  item: MOCK_ITEM,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};

DefaultMD.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const DefaultXS = Template.bind({});
DefaultXS.args = {
  item: MOCK_ITEM,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};

DefaultXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const DefaultMDWithoutFavourite = Template.bind({});
DefaultMDWithoutFavourite.args = {
  item: MOCK_ITEM,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: false,
};

DefaultMDWithoutFavourite.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const DefaultXSWithoutFavourite = Template.bind({});
DefaultXSWithoutFavourite.args = {
  item: MOCK_ITEM,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: false,
};

DefaultXSWithoutFavourite.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const ReservedMD = Template.bind({});
ReservedMD.args = {
  item: MOCK_ITEM_RESERVED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
ReservedMD.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const SoldXS = Template.bind({});
SoldXS.args = {
  item: MOCK_ITEM_SOLD,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
SoldXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const BumpedMD = Template.bind({});
BumpedMD.args = {
  item: MOCK_ITEM_BUMPED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
BumpedMD.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const CountryBumpedXS = Template.bind({});
CountryBumpedXS.args = {
  item: MOCK_ITEM_COUNTRY_BUMPED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
CountryBumpedXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};

export const FavouritedMD = Template.bind({});
FavouritedMD.args = {
  item: MOCK_ITEM_FAVOURITE,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
FavouritedMD.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const WithoutImagesMD = Template.bind({});
WithoutImagesMD.args = {
  item: MOCK_ITEM_WITHOUT_IMAGES,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
WithoutImagesMD.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const WithoutImagesXS = Template.bind({});
WithoutImagesXS.args = {
  item: MOCK_ITEM_WITHOUT_IMAGES,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
WithoutImagesXS.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
