import { CommonModule } from '@angular/common';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ItemCardModule } from '../item-card/item-card.module';
import { ItemCardListComponent } from './item-card-list.component';

export default {
  title: 'Webapp/ItemCardList',
  decorators: [
    moduleMetadata({
      declarations: [ItemCardListComponent],
      imports: [CommonModule, ItemCardModule],
    }),
  ],
} as Meta;

const Template: Story<ItemCardListComponent> = (
  args: ItemCardListComponent
) => ({
  component: ItemCardListComponent,
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
  items: [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM],
};
