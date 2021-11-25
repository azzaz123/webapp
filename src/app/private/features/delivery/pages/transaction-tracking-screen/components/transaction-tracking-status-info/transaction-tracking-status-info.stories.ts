import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionTrackingStatusInfo',
  component: TransactionTrackingStatusInfoComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TransactionTrackingStatusInfoComponent> = (args: TransactionTrackingStatusInfoComponent) => ({
  component: TransactionTrackingStatusInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionTrackingStatusInfoComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-transaction-tracking-status-info [transactionTrackingStatusInfo]="transactionTrackingStatusInfo" [hasBorderBottom]="hasBorderBottom"></tsl-transaction-tracking-status-info>',
});

export const ProductExample = Template.bind({});
ProductExample.args = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://i/190584802',
    },
  },
  description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
    style: {
      className: 'rounded',
    },
  },
  showCaret: true,
};

export const UserExample = Template.bind({});
UserExample.args = {
  action: {
    isCarrierTrackingWebview: false,
    isDeeplink: true,
    isDialog: false,
    isDismiss: false,
    isReload: false,
    isUserAction: false,
    payload: {
      linkUrl: 'wallapop://p/76921033',
    },
  },
  description: '<span style="color: #AFB6B6">Vendido por:</span><br>Coccofresco F.',
  icon: {
    url: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?pictureSize=W800',
    thumbnailUrl: 'https://cdn-beta.wallapop.com/images/13/19/so/__/c13p76921033/i416234105.jpg?size=medium',
    style: {
      className: 'circle',
    },
  },
  showCaret: true,
};

export const PriceExample = Template.bind({});
PriceExample.args = {
  transactionTrackingStatusInfo: {
    action: null,
    description: '<span style="color: #AFB6B6">Total:</span><br>5.90€',
    icon: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png',
      thumbnailUrl:
        'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/transaction_tracking_details/price_element.png?size=medium',
      style: {
        className: null,
      },
    },
    showCaret: false,
  },
};

export const ActionClickable = Template.bind({});
ActionClickable.args = {
  transactionTrackingStatusInfo: {
    action: {
      isCarrierTrackingWebview: false,
      isDeeplink: true,
      isDialog: false,
      isDismiss: false,
      isReload: false,
      isUserAction: false,
      payload: {
        linkUrl: 'wallapop://customerSupport/faq/article?z=360001796618',
      },
    },
    description:
      '<strong>Tu compra está protegida</strong> por Wallapop Protect, nuestra política de protección.<br><span style="color: #13C1AC">¿Quieres saber más?</span>',
    icon: {
      url: 'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
      thumbnailUrl:
        'https://prod-delivery-resources.wallapop.com/transaction-tracking-screen/payment+status/Icons/Delivery/Bank+Account+Warranty%402x.png',
      style: {
        className: null,
      },
    },
    showCaret: false,
  },
};

export const BorderBottom = Template.bind({});
BorderBottom.args = {
  transactionTrackingStatusInfo: {
    action: {
      isCarrierTrackingWebview: false,
      isDeeplink: true,
      isDialog: false,
      isDismiss: false,
      isReload: false,
      isUserAction: false,
      payload: {
        linkUrl: 'wallapop://i/190584802',
      },
    },
    description: '<span style="color: #AFB6B6">Producto:</span><br>crayones',
    icon: {
      url: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?pictureSize=W800',
      thumbnailUrl: 'https://cdn-beta.wallapop.com/images/10420/35/gw/__/c10420p190584802/i421614104.jpg?size=medium',
      style: {
        className: 'rounded',
      },
    },
    showCaret: true,
  },
  hasBorderBottom: true,
};
