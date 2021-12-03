import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { TransactionTrackingStatusInfoComponent } from './transaction-tracking-status-info.component';
import {
  MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1,
  MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_2,
  MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_1,
} from '@api/fixtures/core/model/transaction/tracking/transaction-tracking-details.fixtures.spec';
import { MOCK_TRANSACTION_TRACKING_STATUS_INFO_DEEPLINK_2 } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { TransactionTrackingActionSelectorModule } from '../transaction-tracking-action-details/transaction-tracking-action-selector/transaction-tracking-action-selector.module';
import { BypassHTMLModule } from '@shared/pipes/bypass-html/bypass-html.module';

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
    imports: [CommonModule, SvgIconModule, HttpClientModule, TransactionTrackingActionSelectorModule, BypassHTMLModule],
  },
  template:
    '<tsl-transaction-tracking-status-info [transactionTrackingStatusInfo]="transactionTrackingStatusInfo" [hasBorderBottom]="hasBorderBottom"></tsl-transaction-tracking-status-info>',
});

export const ProductExample = Template.bind({});
ProductExample.args = { transactionTrackingStatusInfo: MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_1 };

export const UserExample = Template.bind({});
UserExample.args = { transactionTrackingStatusInfo: MOCK_TRANSACTION_TRACKING_DETAILS_INFO_DEEPLINK_2 };

export const PriceExample = Template.bind({});
PriceExample.args = { transactionTrackingStatusInfo: MOCK_TRANSACTION_TRACKING_DETAILS_INFO_NO_ACTION_1 };
