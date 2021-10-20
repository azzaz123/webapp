import { Story, Meta } from '@storybook/angular/types-6-0';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CommonModule } from '@angular/common';
import { SubscriptionBenefitComponent } from './subscription-benefit.component';
import { HttpClientModule } from '@angular/common/http';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';

export default {
  title: 'Webapp/Private/Features/Profile/Components/SubscriptionBenefit',
  component: SubscriptionBenefitComponent,
  decorators: [styledWrapperDecorator('max-width: 992px;')],
} as Meta;

const Template: Story<SubscriptionBenefitComponent> = (args: SubscriptionBenefitComponent) => ({
  component: SubscriptionBenefitComponent,
  props: args,
  moduleMetadata: {
    declarations: [SubscriptionBenefitComponent],
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-subscription-benefit [title]="title" [description]="description" [img]="img" [leftAligment]="leftAligment"></tsl-subscription-benefit>',
});

export const Default = Template.bind({});
Default.args = {
  img: '/assets/images/subscriptions/benefits/en/img-1.png',
  title: 'Title',
  description: 'Description test',
  leftAligment: true,
};

export const Inverse = Template.bind({});
Inverse.args = {
  img: '/assets/images/subscriptions/benefits/en/img-1.png',
  title: 'Title',
  description: 'Description test',
  leftAligment: false,
};
