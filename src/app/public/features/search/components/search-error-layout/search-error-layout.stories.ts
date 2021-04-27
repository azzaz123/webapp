import { Meta, Story } from '@storybook/angular/types-6-0';
import { moduleMetadata } from '@storybook/angular';
import { CUSTOM_VIEWPORT_NAME } from '@storybook-config/viewports/custom-viewports';
import { ViewportService } from '@core/viewport/viewport.service';
import { SearchErrorLayoutComponent } from './search-error-layout.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorBoxModule } from '@shared/error-box/error-box.module';

export default {
  title: 'Webapp/Public/Features/Search/Components/Search without results layout',
  component: SearchErrorLayoutComponent,
  decorators: [
    moduleMetadata({
      imports: [RouterTestingModule, ErrorBoxModule],
      providers: [ViewportService],
    }),
  ],
} as Meta;

const Template: Story<SearchErrorLayoutComponent> = (args) => ({
  props: args,
  template: `
    <tsl-search-error-layout>
    </tsl-search-error-layout>`,
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
