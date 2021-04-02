import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconCheckComponent } from './icon-check.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheck/IconCheck',
  component: IconCheckComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconCheckComponent],
      imports: [HttpClientModule, SvgIconModule],
    }),
  ],
};

const Template: Story<IconCheckComponent> = (args) => ({
  props: args,
  component: IconCheckComponent,
  template: `
    <div style="display: flex">
      <div style="background: white; border: 1px dashed black;">
          <tsl-icon-check [icon]="icon" [label]="label"></tsl-icon-check>
      </div>
    </div>

  `,
});

export const Default = Template.bind({});
Default.args = {
  icon: '/assets/icons/joke.svg',
  label: 'Joke!',
};

export const NoLabel = Template.bind({});
NoLabel.args = {
  icon: '/assets/icons/joke.svg',
};
