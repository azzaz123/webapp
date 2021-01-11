import { SearchLayoutComponent } from '@public/features/search/components/search-layout/search-layout.component';
import { Meta, Story } from '@storybook/angular/types-6-0';

export default {
  title: 'Webapp/Layouts/Search Layout',
  component: SearchLayoutComponent,
} as Meta;

const Template: Story<SearchLayoutComponent> = (args) => ({
  component: SearchLayoutComponent,
  props: args,
});

export const Default = Template.bind({});
Default.args = {};
