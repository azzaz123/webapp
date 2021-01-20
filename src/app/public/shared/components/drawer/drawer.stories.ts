import { DrawerComponent } from '@public/shared/components/drawer/drawer.component';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { StyledBoxComponent } from '@stories/components/styled-box/styled-box.component';

export default {
  title: 'Webapp/Drawer',
  component: DrawerComponent,
  decorators: [
    moduleMetadata({
      declarations: [StyledBoxComponent, DrawerComponent],
    }),
    styledWrapperDecorator('margin: -16px'),
  ],
} as Meta;

const boxStyle = `
  {
    backgroundColor: '#b0bec5',
    height: '100%',
    minHeight: '100px'
  }
`;

const OnRootTemplate: Story<DrawerComponent> = (args) => ({
  props: args,
  component: DrawerComponent,
  template: `<tsl-drawer>Content!</tsl-drawer>`,
});

const WithParentTemplate: Story<DrawerComponent> = (args) => ({
  props: args,
  component: DrawerComponent,
  template: `
    <div>
      <stories-styled-box [style]="${boxStyle}"></stories-styled-box>
      <tsl-drawer>Content!</tsl-drawer>
    </div>
  `,
});

export const Default = OnRootTemplate.bind({});

export const WithParent = WithParentTemplate.bind({});

export const WithForcedPositioning = OnRootTemplate.bind({});
WithForcedPositioning.args = {
  top: 100,
  bottom: 100,
};
