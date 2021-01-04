import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { moduleMetadata } from '@storybook/angular';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconComponent } from './favourite-icon.component';

export default {
  title: 'Webapp/FavouriteIcon',
  decorators: [
    moduleMetadata({
      declarations: [FavouriteIconComponent],
      imports: [SvgIconModule, HttpClientModule],
    }),
  ],
} as Meta;

const Template: Story<FavouriteIconComponent> = (
  args: FavouriteIconComponent
) => ({
  component: FavouriteIconComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
  active: false,
};
