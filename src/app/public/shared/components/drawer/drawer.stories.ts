import { DrawerComponent } from '@public/shared/components/drawer/drawer.component';
import { moduleMetadata } from '@storybook/angular';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { StyledBoxComponent } from '@stories/components/styled-box/styled-box.component';
import { LoremIpsumComponent } from '@stories/components/lorem-ipsum/lorem-ipsum.component';
import { stringifyStyleObj } from '@stories/helpers/stringify-style';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';
import { ButtonModule } from '@shared/button/button.module';

export default {
  title: 'Webapp/Public/Shared/Components/Drawer',
  component: DrawerComponent,
  decorators: [
    moduleMetadata({
      imports: [ButtonModule],
      declarations: [StyledBoxComponent, DrawerComponent, LoremIpsumComponent],
      providers: [ScrollLockService],
    }),
    styledWrapperDecorator('margin: -16px'),
  ],
} as Meta;

const pageStyle = stringifyStyleObj({
  minHeight: '100vh',
  paddingTop: '100px',
  paddingBottom: '100px',
  position: 'relative',
});

const headerStyle = stringifyStyleObj({
  backgroundColor: '#b0bec5',
  height: '100px',
  width: '100%',
  position: 'fixed',
  zIndex: '1000',
  top: '0',
});

const footerStyle = stringifyStyleObj({
  backgroundColor: '#b0bec5',
  height: '100px',
  width: '100%',
  position: 'absolute',
  bottom: '0',
});

const Template: Story<DrawerComponent> = (args) => ({
  props: args,
  component: DrawerComponent,
  template: `
    <div [ngStyle]="${pageStyle}">
      <tsl-drawer [isOpen]="isOpen" [offsetTop]="offsetTop">
        <p>Drawer Content!</p>
        <stories-lorem-ipsum></stories-lorem-ipsum>
      </tsl-drawer>
      <stories-styled-box [style]="${headerStyle}"></stories-styled-box>
      <div style="padding: 50px;">
        <stories-lorem-ipsum></stories-lorem-ipsum>
        <stories-lorem-ipsum></stories-lorem-ipsum>
        <stories-lorem-ipsum></stories-lorem-ipsum>
        <stories-lorem-ipsum></stories-lorem-ipsum>
      </div>
      <stories-styled-box [style]="${footerStyle}"></stories-styled-box>
    </div>
  `,
});

const defaultArgs = {
  offsetTop: 0,
  isOpen: false,
};

export const Closed = Template.bind({});
Closed.args = defaultArgs;

export const Opened = Template.bind({});
Opened.args = {
  ...defaultArgs,
  isOpen: true,
};

export const WithForcedPositioning = Template.bind({});
WithForcedPositioning.args = {
  ...defaultArgs,
  isOpen: true,
  offsetTop: 100,
};
