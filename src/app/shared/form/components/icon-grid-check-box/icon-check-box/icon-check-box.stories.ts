import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconCheckBoxComponent } from './icon-check-box.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheckBox/IconCheckBox',
  component: IconCheckBoxComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconCheckBoxComponent],
      imports: [HttpClientModule, SvgIconModule],
    }),
  ],
};

const Template: Story<IconCheckBoxComponent> = (args) => ({
  props: args,
  component: IconCheckBoxComponent,
  template: `
    <div style="display: flex">
      <div style="background: white; border: 1px dashed black;">
          <tsl-icon-check-box [icon]="icon" [label]="label" [isBig]="isBig" [isActive]="isActive"></tsl-icon-check-box>
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
