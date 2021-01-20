import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ItemCardComponent } from './item-card.component';
import {
  MOCK_ITEM_1,
  MOCK_ITEM_2,
  MOCK_ITEM_3,
  MOCK_ITEM_4,
  MOCK_ITEM_5,
  MOCK_ITEM_6,
  MOCK_ITEM_7,
} from './item-card.mock.stories';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';

export default {
  title: 'Webapp/ItemCard',
  component: ItemCardComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
  argTypes: { toggleFavourite: { action: 'toggleFavourite' } },
} as Meta;

const Template: Story<ItemCardComponent> = (args: ItemCardComponent) => ({
  component: ItemCardComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemCardComponent],
    imports: [
      CommonModule,
      FavouriteIconModule,
      CustomCurrencyModule,
      SvgIconModule,
      HttpClientModule,
      ImageFallbackModule,
    ],
  },
  template:
    '<tsl-public-item-card [item]="item" [showDescription]="showDescription" [showFavourite]="showFavourite" (toggleFavourite)="toggleFavourite()"></tsl-public-item-card>',
});

export const Default = Template.bind({});
Default.args = {
  item: MOCK_ITEM_1,
};

export const WithoutFavourite = Template.bind({});
WithoutFavourite.args = {
  item: MOCK_ITEM_1,
  showFavourite: false,
};

export const WithoutDescription = Template.bind({});
WithoutDescription.args = {
  item: MOCK_ITEM_1,
  showDescription: false,
};

export const LongInfo = Template.bind({});
LongInfo.args = {
  showDescription: true,
  item: MOCK_ITEM_2,
};

export const Favorited = Template.bind({});
Favorited.args = {
  item: MOCK_ITEM_3,
};

export const Reserved = Template.bind({});
Reserved.args = {
  item: MOCK_ITEM_4,
};

export const Sold = Template.bind({});
Sold.args = {
  item: MOCK_ITEM_5,
};

export const Bumped = Template.bind({});
Bumped.args = {
  item: MOCK_ITEM_6,
};

export const BumpedAndReserved = Template.bind({});
BumpedAndReserved.args = {
  item: MOCK_ITEM_7,
};
