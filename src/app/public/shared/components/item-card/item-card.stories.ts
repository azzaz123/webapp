import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { moduleMetadata } from '@storybook/angular';
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

export default {
  title: 'Webapp/ItemCard',
  decorators: [
    moduleMetadata({
      declarations: [ItemCardComponent],
      imports: [
        CommonModule,
        FavouriteIconModule,
        CustomCurrencyModule,
        SvgIconModule,
        SanitizedBackgroundModule,
        HttpClientModule,
      ],
    }),
  ],
  argTypes: { toggleFavourite: { action: 'toggleFavourite' } },
} as Meta;

const Template: Story<ItemCardComponent> = (args: ItemCardComponent) => ({
  component: ItemCardComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  item: MOCK_ITEM_1,
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
