import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionDetailComponent } from '@private/features/delivery/pages/transaction-tracking-screen/components/transaction-details/transaction-detail/transaction-detail.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionDetail',
  component: TransactionDetailComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TransactionDetailComponent> = (args: TransactionDetailComponent) => ({
  component: TransactionDetailComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionDetailComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-transaction-detail [transactionDetail]="transactionDetail" [isClickableAction]="isClickableAction" [hasBorderBottom]="hasBorderBottom"></tsl-transaction-detail>',
});

export const ProductExample = Template.bind({});
ProductExample.args = {
  transactionDetail: {
    description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
    showCaret: true,
    iconClassName: 'rounded',
    iconSrc: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  },
};

export const UserExample = Template.bind({});
UserExample.args = {
  transactionDetail: {
    description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
    showCaret: true,
    iconClassName: 'circle',
    iconSrc: 'http://localhost:6006/images/item-camera.jpg',
  },
};

export const PriceExample = Template.bind({});
PriceExample.args = {
  transactionDetail: {
    description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
    showCaret: false,
    iconClassName: 'rounded',
    iconSrc: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
  },
};

export const ActionClickable = Template.bind({});
ActionClickable.args = {
  transactionDetail: {
    description:
      '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
    showCaret: false,
    iconClassName: 'rounded',
    iconSrc:
      'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
  },
  isClickableAction: true,
};

export const BorderBottom = Template.bind({});
BorderBottom.args = {
  transactionDetail: {
    description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
    showCaret: true,
    iconClassName: 'rounded',
    iconSrc: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
  },
  hasBorderBottom: true,
};
