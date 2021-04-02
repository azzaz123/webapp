import { moduleMetadata } from '@storybook/angular';
import { Story } from '@storybook/angular/types-6-0';
import { HttpClientModule } from '@angular/common/http';
import { IconGridCheckFormComponent } from './icon-grid-check-form.component';

export default {
  title: 'Webapp/Shared/Form/Components/IconGridCheck',
  component: IconGridCheckFormComponent,
  decorators: [
    moduleMetadata({
      declarations: [IconGridCheckFormComponent],
      imports: [HttpClientModule],
    }),
  ],
};

const Template: Story<IconGridCheckFormComponent> = (args) => ({
  props: args,
  component: IconGridCheckFormComponent,
});

export const Default = Template.bind({});
