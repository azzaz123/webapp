import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionInfoComponent } from './transaction-info.component';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionInfo',
  component: TransactionInfoComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TransactionInfoComponent> = (args: TransactionInfoComponent) => ({
  component: TransactionInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionInfoComponent],
    imports: [CommonModule],
  },
  template: '<tsl-transaction-info [transactionInfo]="transactionInfo"></tsl-transaction-info>',
});

export const Default = Template.bind({});
Default.args = {
  transactionInfo: {
    user: {
      imageSrc: 'http://localhost:6006/images/item-pc.jpg',
      className: 'circle',
    },
    item: {
      name: 'Connie',
      price: '5.9€',
      imageSrc: 'http://localhost:6006/images/item-camera.jpg',
      className: 'rounded',
    },
  },
};

export const BigName = Template.bind({});
BigName.args = {
  transactionInfo: {
    user: {
      imageSrc: 'http://localhost:6006/images/item-pc.jpg',
      className: 'circle',
    },
    item: {
      name: 'Connieeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      price: '5.9€',
      imageSrc: 'http://localhost:6006/images/item-camera.jpg',
      className: 'rounded',
    },
  },
};

export const BigPrice = Template.bind({});
BigPrice.args = {
  transactionInfo: {
    user: {
      imageSrc: 'http://localhost:6006/images/item-pc.jpg',
      className: 'circle',
    },
    item: {
      name: 'Connie',
      price: '22222222222222222222222222222222222222222222225.9€',
      imageSrc: 'http://localhost:6006/images/item-camera.jpg',
      className: 'rounded',
    },
  },
};
