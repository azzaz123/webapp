import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconCheckComponent } from './icon-check.component';

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheck/IconCheck',
  component: IconCheckComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconCheckComponent],
      imports: [HttpClientModule],
    }),
  ],
};

const Template: Story<IconCheckComponent> = (args) => ({
  props: args,
  component: IconCheckComponent,
});

export const Default = Template.bind({});
