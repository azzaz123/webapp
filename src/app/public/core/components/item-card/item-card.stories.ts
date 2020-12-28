import { CommonModule } from '@angular/common';
import { Item } from '@core/item/item';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ITEM_DATA, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { ItemCardComponent } from './item-card.component';

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
      ],
    }),
  ],
} as Meta;

const Template: Story<ItemCardComponent> = (args: ItemCardComponent) => ({
  component: ItemCardComponent,
  props: args,
});

MOCK_ITEM.mainImage.urls_by_size = {
  original:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=ORIGINAL',
  small:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W320',
  large:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W800',
  medium:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W640',
  xlarge:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W1024',
};

export const Default = Template.bind({});
Default.args = {
  showDescription: true,
  item: MOCK_ITEM,
};

export const LongInfo = Template.bind({});
const MOCK_ITEM_2 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  'Title max chars, title max chars, title max chars,',
  'Long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max chars, long description max ch',
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  ITEM_DATA.flags,
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
LongInfo.args = {
  showDescription: true,
  item: MOCK_ITEM_2,
};

export const Favorited = Template.bind({});
const MOCK_ITEM_3 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: true,
    sold: false,
    reserved: false,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
Favorited.args = {
  showDescription: true,
  item: MOCK_ITEM_3,
};

export const Reserved = Template.bind({});
const MOCK_ITEM_4 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
Reserved.args = {
  showDescription: true,
  item: MOCK_ITEM_4,
};

export const Sold = Template.bind({});
const MOCK_ITEM_5 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: true,
    reserved: false,
    bumped: false,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
Sold.args = {
  showDescription: true,
  item: MOCK_ITEM_5,
};

export const Bumped = Template.bind({});
const MOCK_ITEM_6 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: false,
    bumped: true,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);
Bumped.args = {
  showDescription: true,
  item: MOCK_ITEM_6,
};

export const BumpedAndReserved = Template.bind({});
const MOCK_ITEM_7 = new Item(
  ITEM_DATA.id,
  ITEM_DATA.legacy_id,
  ITEM_DATA.owner,
  ITEM_DATA.title,
  ITEM_DATA.description,
  ITEM_DATA.category_id,
  ITEM_DATA.location,
  ITEM_DATA.sale_price,
  ITEM_DATA.currency_code,
  ITEM_DATA.modified_date,
  ITEM_DATA.url,
  {
    pending: false,
    banned: false,
    expired: false,
    favorite: false,
    sold: false,
    reserved: true,
    bumped: true,
  },
  ITEM_DATA.actions_allowed,
  ITEM_DATA.sale_conditions,
  ITEM_DATA.main_image,
  ITEM_DATA.images,
  ITEM_DATA.web_slug,
  ITEM_DATA.published_date,
  ITEM_DATA.delivery_info
);

BumpedAndReserved.args = {
  showDescription: true,
  item: MOCK_ITEM_7,
};
