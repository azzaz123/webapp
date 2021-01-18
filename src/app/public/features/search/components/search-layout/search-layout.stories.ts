import { SearchLayoutComponent } from '@public/features/search/components/search-layout/search-layout.component';
import { Meta, Story } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { moduleMetadata } from '@storybook/angular';
import { LoremIpsumComponent } from '@stories/components/lorem-ipsum/lorem-ipsum.component';
import { StyledBoxComponent } from '@stories/components/colored-box/styled-box.component';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { ViewportService } from '@core/viewport/viewport.service';

export default {
  title: 'Webapp/Layouts/Search Layout',
  component: SearchLayoutComponent,
  decorators: [
    moduleMetadata({
      declarations: [LoremIpsumComponent, StyledBoxComponent],
      providers: [ViewportService],
    }),
    styledWrapperDecorator('margin: -1rem;'),
  ],
} as Meta;

const boxStyle = `
  {
    backgroundColor: '#b0bec5',
    height: '100%',
    minHeight: '100px'
  }
`;

const Template: Story<SearchLayoutComponent> = (args) => ({
  component: SearchLayoutComponent,
  props: args,
  moduleMetadata: {
    declarations: [SearchLayoutComponent],
  },
  template: `<tsl-search-layout>
      <stories-lorem-ipsum main></stories-lorem-ipsum>
      <stories-styled-box top [style]="${boxStyle}"></stories-styled-box>
      <stories-styled-box right [style]="${boxStyle}"></stories-styled-box>
      <stories-styled-box bottom [style]="${boxStyle}"></stories-styled-box>
    </tsl-search-layout>`,
});

export const Default = Template.bind({});

export const ExtraLarge = Template.bind({});
ExtraLarge.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XL,
  },
};

export const Large = Template.bind({});
Large.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.LG,
  },
};

export const Medium = Template.bind({});
Medium.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.MD,
  },
};

export const Small = Template.bind({});
Small.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.SM,
  },
};

export const ExtraSmall = Template.bind({});
ExtraSmall.parameters = {
  viewport: {
    defaultViewport: CUSTOM_VIEWPORT_NAME.XS,
  },
};
