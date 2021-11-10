import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { HttpClientModule } from '@angular/common/http';
import { TransactionTrackingGeneralInfoComponent } from './transaction-tracking-general-info.component';
import { ButtonModule } from '@shared/button/button.module';
import { LottieModule } from '@shared/lottie/lottie.module';
import { MOCK_TRANSACTION_TRACKING_GENERAL_INFO } from '@fixtures/private/delivery/TTS/transaction-tracking-general-info.fixtures.spec';

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
    imports: [CommonModule, ButtonModule, LottieModule, HttpClientModule],
  },
  template:
    '<tsl-transaction-tracking-general-info [transactionTrackingGeneralInfo]="transactionTrackingGeneralInfo"></tsl-transaction-tracking-general-info>',
});

export const Default = Template.bind({});
Default.args = {
  transactionTrackingGeneralInfo: MOCK_TRANSACTION_TRACKING_GENERAL_INFO,
};
