import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { FavoriteSearchButtonComponent } from './favorite-search-button.component';

export default {
  title: 'Webapp/Public/Shared/Components/FavoriteSearchButton',
  component: FavoriteSearchButtonComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<FavoriteSearchButtonComponent> = (args: FavoriteSearchButtonComponent) => ({
  component: FavoriteSearchButtonComponent,
  props: args,
  moduleMetadata: {
    declarations: [FavoriteSearchButtonComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template: `<tsl-favorite-search-button [className]="className" [svgSrc]="svgSrc" [isActive]="isActive"></tsl-favorite-search-button>`,
});

export const Active = Template.bind({});
Active.args = {
  className: 'search-active',
  isActive: true,
  svgSrc: '/assets/icons/fullheart-fs.svg',
};

export const Inactive = Template.bind({});
Inactive.args = {
  className: 'search-inactive',
  isActive: false,
  svgSrc: '/assets/icons/emptyheart-fs.svg',
};
