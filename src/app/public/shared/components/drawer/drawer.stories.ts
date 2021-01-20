import { DrawerComponent } from '@public/shared/components/drawer/drawer.component';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { DrawerModule } from '@public/shared/components/drawer/drawer.module';

export default {
  title: 'Webapp/Drawer',
  component: DrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [DrawerModule],
    }),
  ],
} as Meta;

const Template: Story<DrawerComponent> = (args) => ({
  props: args,
  component: DrawerComponent,
});

export const Default = Template.bind({});
