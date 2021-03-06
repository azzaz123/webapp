import { Story, Meta } from '@storybook/angular/types-6-0';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { moduleMetadata } from '@storybook/angular';
import { ButtonModule } from '@shared/button/button.module';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { COLORS } from '@core/colors/colors-constants';

export default {
  title: 'Webapp/Shared/Modals/ConfirmationModal',
  decorators: [
    moduleMetadata({
      declarations: [ConfirmationModalComponent],
      imports: [ButtonModule],
      providers: [NgbActiveModal],
    }),
  ],
  argTypes: { primaryBtnClick: { action: 'primaryBtnClick' }, secondaryBtnClick: { action: 'secondaryBtnClick' } },
} as Meta;

const Template: Story<ConfirmationModalComponent> = (args: ConfirmationModalComponent) => ({
  component: ConfirmationModalComponent,
  props: args,
});

export const GreenConfirmColor = Template.bind({});
GreenConfirmColor.args = {
  properties: {
    title: 'This is a title!',
    description: 'This is the modal description',
    confirmMessage: 'Confirm',
    confirmColor: COLORS.WALLA_MAIN,
  },
};

export const RedConfirmColor = Template.bind({});
RedConfirmColor.args = {
  properties: {
    title: 'This is a title!',
    description: 'This is the modal description',
    confirmMessage: 'Delete',
    confirmColor: COLORS.NEGATIVE_MAIN,
  },
};
