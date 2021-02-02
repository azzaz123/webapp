import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ITEM_FLAG_TYPES } from './item-flag-constants';
import { ItemFlagComponent } from './item-flag.component';

export default {
  title: 'Webapp/Public/Shared/Components/ItemFlag',
} as Meta;

const Template: Story<ItemFlagComponent> = (args: ItemFlagComponent) => ({
  component: ItemFlagComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemFlagComponent],
    imports: [SvgIconModule, HttpClientModule],
  },
  template: `<div style="width: 400px"> <tsl-item-flag [type]="type">{{content}}</tsl-item-flag> </div>`,
});

export const Default = Template.bind({});
Default.args = {
  type: ITEM_FLAG_TYPES.DEFAULT,
  content: 'Text',
};
export const Sold = Template.bind({});
Sold.args = {
  type: ITEM_FLAG_TYPES.SOLD,
};
export const Reserved = Template.bind({});
Reserved.args = {
  type: ITEM_FLAG_TYPES.RESERVED,
};
export const Expired = Template.bind({});
Expired.args = {
  type: ITEM_FLAG_TYPES.EXPIRED,
};
export const Inactive = Template.bind({});
Inactive.args = {
  type: ITEM_FLAG_TYPES.INACTIVE,
};
export const Featured = Template.bind({});
Featured.args = {
  type: ITEM_FLAG_TYPES.BUMPED,
};
export const CountryBumped = Template.bind({});
CountryBumped.args = {
  type: ITEM_FLAG_TYPES.COUNTRY_BUMP,
};
