import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TRXAwarenessModalComponent } from './trx-awareness-modal.component';
import { LottieModule } from '@shared/lottie/lottie.module';
import { ButtonModule } from '@shared/button/button.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export default {
  title: 'Webapp/Private/Features/Delivery/Modals/TRXAwarenessModal',
  component: TRXAwarenessModalComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TRXAwarenessModalComponent> = (args: TRXAwarenessModalComponent) => ({
  component: TRXAwarenessModalComponent,
  props: args,
  moduleMetadata: {
    declarations: [TRXAwarenessModalComponent],
    providers: [NgbActiveModal],
    imports: [CommonModule, LottieModule, ButtonModule, HttpClientModule],
  },
  template: '<tsl-trx-awareness-modal></tsl-trx-awareness-modal>',
});

export const Default = Template.bind({});
Default.args = {};
