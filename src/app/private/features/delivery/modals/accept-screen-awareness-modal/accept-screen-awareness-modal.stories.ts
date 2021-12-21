import { CommonModule } from '@angular/common';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { LottieModule } from '@shared/lottie/lottie.module';
import { ButtonModule } from '@shared/button/button.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AcceptScreenAwarenessModalComponent } from './accept-screen-awareness-modal.component';

export default {
  title: 'Webapp/Private/Features/Delivery/Modals/AcceptScreenAwarenessModal',
  component: AcceptScreenAwarenessModalComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<AcceptScreenAwarenessModalComponent> = (args: AcceptScreenAwarenessModalComponent) => ({
  component: AcceptScreenAwarenessModalComponent,
  props: args,
  moduleMetadata: {
    declarations: [AcceptScreenAwarenessModalComponent],
    providers: [NgbActiveModal],
    imports: [CommonModule, LottieModule, ButtonModule, HttpClientModule],
  },
  template: '<tsl-accept-screen-awareness-modal></tsl-accept-screen-awareness-modal>',
});

export const Default = Template.bind({});
Default.args = {};
