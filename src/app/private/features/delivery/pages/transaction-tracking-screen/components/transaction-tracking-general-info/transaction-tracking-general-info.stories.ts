import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { MOCK_TRANSACTION_TRACKING } from '@api/fixtures/core/model/transaction/tracking/transaction-tracking.fixtures.spec';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TransactionTrackingActionsService } from '@private/features/delivery/services/transaction-tracking/transaction-tracking-actions/transaction-tracking-actions.service';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionTrackingGeneralInfo',
  component: TransactionTrackingGeneralInfoComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TransactionTrackingGeneralInfoComponent> = (args: TransactionTrackingGeneralInfoComponent) => ({
  component: TransactionTrackingGeneralInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionTrackingGeneralInfoComponent],
    imports: [CommonModule, ButtonModule, LottieModule, HttpClientTestingModule],
    providers: [TransactionTrackingActionsService],
  },
  template: '<tsl-transaction-tracking-general-info [shippingStatus]="shippingStatus"></tsl-transaction-tracking-general-info>',
});

export const Default = Template.bind({});
Default.args = {
  shippingStatus: MOCK_TRANSACTION_TRACKING.shippingStatus,
};
