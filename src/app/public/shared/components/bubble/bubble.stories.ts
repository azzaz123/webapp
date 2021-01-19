import {
  BubbleComponent,
  BubbleVariants,
} from '@public/shared/components/bubble/bubble.component';
import { Story } from '@storybook/angular/types-6-0';
import { CoreModule } from '@core/core.module';
import { SvgIconComponent } from '@core/svg-icon/svg-icon/svg-icon.component';
import { HttpModule } from '@core/http/http.module';
import { moduleMetadata } from '@storybook/angular';

export default {
  title: 'Webapp/Abstract components/Bubble',
  component: BubbleComponent,
  argTypes: {
    icon: { control: { type: 'text' } },
    variant: {
      control: { type: 'select', options: BubbleVariants },
    },
    isDropdown: { control: { type: 'boolean' } },
    counter: {
      control: { type: 'number' },
    },
    onClick: { action: 'onClick' },
  },
  decorators: [
    moduleMetadata({
      declarations: [BubbleComponent, SvgIconComponent],
      imports: [CoreModule, HttpModule],
    }),
  ],
};

const Template: Story<BubbleComponent> = (args) => ({
  props: args,
  template: `
      <div style="display: flex; margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" variant="active" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
      <div style="display: flex; margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" variant="selected" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" variant="active" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" variant="selected" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
    `,
});

const VariantTemplate: Story<BubbleComponent> = (args) => ({
  props: args,
  template: `
      <div style="display: flex; margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [variant]="variant" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [variant]="variant" [counter]="counter" [onClick]="onClick">Bubble!</tsl-bubble>
      </div>
  `,
});

export const Default = Template.bind({});

export const WithIcon = Template.bind({});
WithIcon.args = {
  icon: '/assets/icons/category_All.svg',
};

export const WithDropdown = Template.bind({});
WithDropdown.args = {
  isDropdown: true,
};

export const WithCounter = Template.bind({});
WithCounter.args = {
  counter: 8,
};

export const ActiveVariant = VariantTemplate.bind({});
ActiveVariant.args = {
  variant: 'active',
  icon: '/assets/icons/category_All.svg',
  isDropdown: true,
};

export const SelectedVariant = VariantTemplate.bind({});
SelectedVariant.args = {
  variant: 'selected',
  icon: '/assets/icons/category_All.svg',
  isDropdown: true,
};
