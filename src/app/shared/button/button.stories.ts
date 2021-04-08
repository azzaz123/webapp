import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { ButtonComponent } from './button.component';

export default {
  title: 'Webapp/Shared/Button',
  component: ButtonComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<ButtonComponent> = (args: ButtonComponent) => ({
  component: ButtonComponent,
  props: args,
  moduleMetadata: {
    declarations: [ButtonComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-button [className]="className" [classLoading]="classLoading" [type]="type" [disabled]="disabled" [loading]="loading">{{label}}</tsl-button>',
});

export const Default = Template.bind({});
Default.args = {
  label: 'Default',
  className: '',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Reserve = Template.bind({});
Reserve.args = {
  label: 'Reserve',
  className: 'btn-reserve',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Delete = Template.bind({});
Delete.args = {
  label: 'Delete',
  className: 'btn-delete',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Primary = Template.bind({});
Primary.args = {
  label: 'Primary',
  className: 'btn-primary',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Loading = Template.bind({});
Loading.args = {
  label: 'Loading',
  className: 'btn-loading',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Big = Template.bind({});
Big.args = {
  label: 'Big',
  className: 'btn-big',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Feature = Template.bind({});
Feature.args = {
  label: 'Feature',
  className: 'btn-feature',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Inactive = Template.bind({});
Inactive.args = {
  label: 'Inactive',
  className: 'btn-inactive',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const OutlinePrimary = Template.bind({});
OutlinePrimary.args = {
  label: 'Outline Primary',
  className: 'btn-outline-primary',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Gray = Template.bind({});
Gray.args = {
  label: 'Gray',
  className: 'btn-gray',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const ThirdVoice = Template.bind({});
ThirdVoice.args = {
  label: 'Third Voice',
  className: 'btn-third-voice',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Stripe = Template.bind({});
Stripe.args = {
  label: 'Stripe',
  className: 'stripe',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Payment = Template.bind({});
Payment.args = {
  label: 'Payment',
  className: 'payment',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Basic = Template.bind({});
Basic.args = {
  label: 'Basic',
  className: 'basic',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Invoice = Template.bind({});
Invoice.args = {
  label: 'Invoice',
  className: 'invoice',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const Dark = Template.bind({});
Dark.args = {
  label: 'Dark',
  className: 'btn-dark',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};

export const BasicGrey = Template.bind({});
BasicGrey.args = {
  label: 'Basic grey',
  className: 'basic basic--grey',
  classLoading: '',
  type: '',
  disabled: false,
  loading: false,
};
