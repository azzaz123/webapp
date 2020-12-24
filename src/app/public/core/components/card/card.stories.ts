import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemAvatarModule } from '@shared/item-avatar/item-avatar.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CardComponent } from './card.component';

export default {
  title: 'Webapp/Card',
  decorators: [
    moduleMetadata({
      declarations: [CardComponent],
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

const Template: Story<CardComponent> = (args: CardComponent) => ({
  component: CardComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  item: MOCK_ITEM,
};
