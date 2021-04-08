import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { ConfirmationModalV2Component } from './confirmation-modal-v2.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

export default {
  title: 'Webapp/Shared/Modals/ConfirmationModalV2',
  component: ConfirmationModalV2Component,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<ConfirmationModalV2Component> = (args: ConfirmationModalV2Component) => ({
  component: ConfirmationModalV2Component,
  props: args,
  moduleMetadata: {
    declarations: [ConfirmationModalV2Component],
    imports: [HttpClientModule, SvgIconModule],
    providers: [NgbActiveModal],
  },
  template: '<tsl-confirmation-modal-v2></tsl-confirmation-modal-v2>',
});

export const Default = Template.bind({});
Default.args = {};
