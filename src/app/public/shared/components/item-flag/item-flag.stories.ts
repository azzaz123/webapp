import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ItemFlagComponent, ITEM_FLAG_TYPES } from './item-flag.component';

export default {
  title: 'Webapp/ItemFlag',
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `${story.template}`,
      };
    },
  ],
} as Meta;

const Template: Story<ItemFlagComponent> = (args: ItemFlagComponent) => ({
  component: ItemFlagComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemFlagComponent],
    imports: [SvgIconModule, HttpClientModule],
  },
  template: `<tsl-item-flag [type]="type">{{content}}</tsl-item-flag>`,
});

export const Default = Template.bind({});
Default.args = {
  type: ITEM_FLAG_TYPES.TEXT,
  content: 'Text',
};
export const Sold = Template.bind({});
Sold.args = {
  type: ITEM_FLAG_TYPES.SOLD,
  content: 'Sold',
};
export const Reserved = Template.bind({});
Reserved.args = {
  type: ITEM_FLAG_TYPES.RESERVED,
  content: 'Reserved',
};
export const Expired = Template.bind({});
Expired.args = {
  type: ITEM_FLAG_TYPES.EXPIRED,
  content: 'Expired',
};
export const Inactive = Template.bind({});
Inactive.args = {
  type: ITEM_FLAG_TYPES.INACTIVE,
  content: 'Inactive',
};
export const Featured = Template.bind({});
Featured.args = {
  type: ITEM_FLAG_TYPES.FEATURED,
  content: 'Featured',
};
