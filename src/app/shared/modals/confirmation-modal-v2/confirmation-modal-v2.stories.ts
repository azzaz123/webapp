import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { ConfirmationModalV2Component } from './confirmation-modal-v2.component';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from '@shared/button/button.module';

export default {
  title: 'Webapp/Shared/Modals/ConfirmationModalV2',
  decorators: [
    moduleMetadata({
      declarations: [ConfirmationModalV2Component],
      imports: [SvgIconModule, HttpClientModule, ButtonModule],
      providers: [NgbActiveModal],
    }),
  ],
  argTypes: { primaryBtnClick: { action: 'primaryBtnClick' }, secondaryBtnClick: { action: 'secondaryBtnClick' } },
} as Meta;

const Template: Story<ConfirmationModalV2Component> = (args: ConfirmationModalV2Component) => ({
  component: ConfirmationModalV2Component,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  title: 'I am the modal title!',
  text: 'I am just a text, probably containing a question.',
  image: '/assets/images/reactivate-item/reactivate-item.svg',
  primaryBtnText: 'Primary action button',
  secondaryBtnText: 'Secondary action button',
};
