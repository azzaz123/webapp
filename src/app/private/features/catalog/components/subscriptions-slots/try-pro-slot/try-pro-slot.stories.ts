import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TryProSlotComponent } from './try-pro-slot.component';
import { ButtonComponent } from '@shared/button/button.component';

export default {
  title: 'Webapp/Private/Features/Catalog/Components/TryProSlot',
  component: TryProSlotComponent,
  decorators: [styledWrapperDecorator('max-width: 500px;')],
  argTypes: { clickClose: { action: 'close' }, clickCTA: { action: 'clickCTA' } },
} as Meta;

const Template: Story<TryProSlotComponent> = (args: TryProSlotComponent) => ({
  component: TryProSlotComponent,
  props: args,
  moduleMetadata: {
    declarations: [TryProSlotComponent, ButtonComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template: '<tsl-try-pro-slot [hasTrialAvailable]="hasTrialAvailable" (close)="clickClose()" (clickCTA)="clickCTA()"></tsl-try-pro-slot>',
});

export const Default = Template.bind({});
Default.args = {
  hasTrialAvailable: null,
};

export const HasTrial = Template.bind({});
HasTrial.args = {
  hasTrialAvailable: true,
};

export const HasNoTrial = Template.bind({});
HasNoTrial.args = {
  hasTrialAvailable: false,
};
