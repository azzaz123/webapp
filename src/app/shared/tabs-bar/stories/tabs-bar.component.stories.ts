import { Story, Meta } from '@storybook/angular/types-6-0';
import { TabsBarComponent } from '../components/tabs-bar/tabs-bar.component';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { TabsBarElement } from '../interfaces/tabs-bar-element.interface';

const generateTabElements = <T>(numberOfElements: number): TabsBarElement<T>[] => {
  const result: TabsBarElement<T>[] = [];

  Array(numberOfElements)
    .fill({})
    .forEach(() => result.push({ label: 'Title' }));

  return result;
};

export default {
  title: 'Webapp/Shared/TabsBar',
  component: TabsBarComponent,
} as Meta;

const Template: Story<TabsBarComponent<number>> = (args: TabsBarComponent<number>) => ({
  component: TabsBarComponent,
  props: args,
  moduleMetadata: {
    imports: [TabsBarModule],
  },
  templateUrl: './tabs-bar.component.stories.html',
});

export const Default = Template.bind({});
Default.args = {
  fourTabs: generateTabElements(4),
  threeTabs: generateTabElements(3),
  twoTabs: generateTabElements(2),
};
