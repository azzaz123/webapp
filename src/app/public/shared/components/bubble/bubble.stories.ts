import { BubbleComponent } from '@public/shared/components/bubble/bubble.component';
import { Story } from '@storybook/angular/types-6-0';
import { CoreModule } from '@core/core.module';
import { SvgIconComponent } from '@shared/svg-icon/svg-icon.component';
import { HttpModule } from '@core/http/http.module';
import { moduleMetadata } from '@storybook/angular';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.enum';

export default {
  title: 'Webapp/Public/Shared/Components/Bubble',
  component: BubbleComponent,
  argTypes: {
    icon: { control: { type: 'text' } },
    variant: {
      control: { type: 'select', options: BUBBLE_VARIANT },
    },
    isDropdown: { control: { type: 'boolean' } },
    counter: {
      control: { type: 'number' },
    },
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
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [isDropdownOpen]="isDropdownOpen" variant="${BUBBLE_VARIANT.ACTIVE}" [counter]="counter">Bubble!</tsl-bubble>
      </div>
      <div style="display: flex; margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [isDropdownOpen]="isDropdownOpen" variant="${BUBBLE_VARIANT.SELECTED}" [counter]="counter">Bubble!</tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [isDropdownOpen]="isDropdownOpen" variant="${BUBBLE_VARIANT.ACTIVE}" [counter]="counter">Bubble!</tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [isDropdownOpen]="isDropdownOpen" variant="${BUBBLE_VARIANT.SELECTED}" [counter]="counter">Bubble!</tsl-bubble>
      </div>
    `,
});

const VariantTemplate: Story<BubbleComponent> = (args) => ({
  props: args,
  template: `
      <div style="display: flex; margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [variant]="variant"
                    [counter]="counter" [isClearable]="isClearable">
          Bubble!
        </tsl-bubble>
      </div>
      <div style="margin-bottom: 15px;">
        <tsl-bubble [icon]="icon" [isDropdown]="isDropdown" [variant]="variant"
                    [counter]="counter" [isClearable]="isClearable">
          Bubble!
        </tsl-bubble>
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

export const WithDropdownOpen = Template.bind({});
WithDropdownOpen.args = {
  isDropdown: true,
  isDropdownOpen: true,
};

export const WithCounter = Template.bind({});
WithCounter.args = {
  counter: 8,
};

export const WithCounterPlus9 = Template.bind({});
WithCounterPlus9.args = {
  counter: 13,
};

export const ActiveVariant = VariantTemplate.bind({});
ActiveVariant.args = {
  variant: BUBBLE_VARIANT.ACTIVE,
  icon: '/assets/icons/category_All.svg',
  isDropdown: true,
};

export const NotClearableSelectedVariant = VariantTemplate.bind({});
NotClearableSelectedVariant.args = {
  variant: BUBBLE_VARIANT.SELECTED,
  icon: '/assets/icons/category_All.svg',
  isDropdown: true,
};

export const ClearableSelectedVariant = VariantTemplate.bind({});
ClearableSelectedVariant.args = {
  variant: BUBBLE_VARIANT.SELECTED,
  isClearable: true,
};
