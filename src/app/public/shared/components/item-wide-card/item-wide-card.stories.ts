import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SlidesCarouselModule } from '../carousel-slides/carousel-slides.module';
import { ItemExtraInfoModule } from '../item-extra-info/item-extra-info.module';
import { ItemWideCardComponent } from './item-wide-card.component';
import { MOCK_ITEM } from './item-wide-card.mock.stories';

export default {
  title: 'Webapp/Public/Shared/Components/ItemWideCard',
  component: ItemWideCardComponent,
  argTypes: { toggleFavourite: { action: 'toggleFavourite' } },
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
    ],
  },
  template: '<tsl-item-wide-card [item]="item" [itemExtraInfo]="itemExtraInfo" (toggleFavourite)="toggleFavourite()"></tsl-item-wide-card>',
});

const MOCK_ITEM_EXTRA_INFO = ['Cámara De Fotos', '20 cm', 'Digital'];

export const DefaultMD = Template.bind({});
DefaultMD.args = {
  item: MOCK_ITEM,
  itemExtraInfo: MOCK_ITEM_EXTRA_INFO,
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
};

DefaultXSWithoutFavourite.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
