import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ItemExtraInfoModule } from '../item-extra-info/item-extra-info.module';
import { ItemCardWideComponent } from './item-card-wide.component';
import {
  MOCK_ITEM_CARD_WIDE_BUMPED,
  MOCK_ITEM_CARD_WIDE,
  MOCK_ITEM_CARD_WIDE_COUNTRY_BUMPED,
  MOCK_ITEM_CARD_WIDE_FAVOURITE,
  MOCK_ITEM_CARD_WIDE_SOLD,
  MOCK_ITEM_CARD_WIDE_WITHOUT_IMAGES,
  MOCK_ITEM_CARD_WIDE_RESERVED,
} from './item-card-wide.mock.stories';

export default {
  title: 'Webapp/Public/Shared/Components/ItemCardWide',
  decorators: [styledWrapperDecorator('max-width: 685px;')],
  component: ItemCardWideComponent,
  argTypes: { toggleFavourite: { action: 'toggleFavourite' } },
} as Meta;

const Template: Story<ItemCardWideComponent> = (args: ItemCardWideComponent) => ({
  component: ItemCardWideComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemCardWideComponent],
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
    '<tsl-item-card-wide [item]="item" [showFavourite]="showFavourite" [itemExtraInfo]="itemExtraInfo" (toggleFavourite)="toggleFavourite()"></tsl-item-card-wide>',
});

const MOCK_ITEM_EXTRA_INFO = ['Cámara De Fotos', '20 cm', 'Digital'];

export const Default = Template.bind({});
Default.args = {
  item: MOCK_ITEM_CARD_WIDE,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};

Default.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const WithoutFavourite = Template.bind({});
WithoutFavourite.args = {
  item: MOCK_ITEM_CARD_WIDE,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: false,
};

WithoutFavourite.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Reserved = Template.bind({});
Reserved.args = {
  item: MOCK_ITEM_CARD_WIDE_RESERVED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
Reserved.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Sold = Template.bind({});
Sold.args = {
  item: MOCK_ITEM_CARD_WIDE_SOLD,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
Sold.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Bumped = Template.bind({});
Bumped.args = {
  item: MOCK_ITEM_CARD_WIDE_BUMPED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
Bumped.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const CountryBumped = Template.bind({});
CountryBumped.args = {
  item: MOCK_ITEM_CARD_WIDE_COUNTRY_BUMPED,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
CountryBumped.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Favourited = Template.bind({});
Favourited.args = {
  item: MOCK_ITEM_CARD_WIDE_FAVOURITE,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
Favourited.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const WithoutImages = Template.bind({});
WithoutImages.args = {
  item: MOCK_ITEM_CARD_WIDE_WITHOUT_IMAGES,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
  showFavourite: true,
};
WithoutImages.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};
