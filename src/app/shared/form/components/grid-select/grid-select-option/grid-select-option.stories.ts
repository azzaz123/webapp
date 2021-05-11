import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { GridSelectOptionComponent } from './grid-select-option.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

export default {
  title: 'Webapp/Shared/Form/Components/GridSelectForm/GridSelectOption',
  component: GridSelectOptionComponent,
  decorators: [
    moduleMetadata({
      declarations: [GridSelectOptionComponent],
      imports: [HttpClientModule, SvgIconModule],
    }),
  ],
};

const Template: Story<GridSelectOptionComponent> = (args) => ({
  props: args,
  component: GridSelectOptionComponent,
  template: `
    <div style="display: flex">
      <div style="background: white; border: 1px dashed black;">
          <tsl-grid-select-option [icon]="icon" [label]="label" [isBig]="isBig" [isActive]="isActive" [isHoverMainColor]="isHoverMainColor"></tsl-grid-select-option>
      </div>
    </div>

  `,
});

export const Default = Template.bind({});
Default.args = {
  icon: '/assets/icons/joke.svg',
  label: 'Joke!',
};

export const Big = Template.bind({});
Big.args = {
  icon: '/assets/icons/joke.svg',
  label: 'Joke!',
  isBig: true,
};

export const Active = Template.bind({});
Active.args = {
  icon: '/assets/icons/joke.svg',
  label: 'Joke!',
  isActive: true,
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  icon: '/assets/icons/joke.svg',
};

export const WithComplexIcon = Template.bind({});
WithComplexIcon.args = {
  label: 'All categories',
  isBig: true,
  icon: {
    standard: '/assets/icons/filters/categories/all.svg',
    hover: '/assets/icons/filters/categories/all_hover.svg',
    active: '/assets/icons/filters/categories/all_selected.svg',
  },
  isHoverMainColor: true,
};

export const WithComplexIconActive = Template.bind({});
WithComplexIconActive.args = {
  label: 'All categories',
  isBig: true,
  icon: {
    standard: '/assets/icons/filters/categories/all.svg',
    hover: '/assets/icons/filters/categories/all_hover.svg',
    active: '/assets/icons/filters/categories/all_selected.svg',
  },
  isActive: true,
  isHoverMainColor: true,
};
