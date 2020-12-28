import { CommonModule } from '@angular/common';
import { Item } from '@core/item/item';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ITEM_DATA, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
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
        ItemAvatarModule,
        CustomCurrencyModule,
        SvgIconModule,
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
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W320',
  medium:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W320',
  xlarge:
    'http://cdn-dock149.wallapop.com/images/10420/2q/__/c10420p128002/i144005.jpg?pictureSize=W320',
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
