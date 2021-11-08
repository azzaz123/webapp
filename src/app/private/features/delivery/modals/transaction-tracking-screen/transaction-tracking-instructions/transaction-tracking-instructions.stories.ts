import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionTrackingDetailInfoComponent } from '@private/features/delivery/components/transaction-tracking-detail-info/transaction-tracking-detail-info.component';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionTrackingDetailInfo',
  component: TransactionTrackingDetailInfoComponent,
  decorators: [styledWrapperDecorator('max-width: 220px;')],
} as Meta;

const Template: Story<TransactionTrackingDetailInfoComponent> = (args: TransactionTrackingDetailInfoComponent) => ({
  component: TransactionTrackingDetailInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionTrackingDetailInfoComponent],
    imports: [CommonModule, SvgIconModule],
  },
  template: '<tsl-transaction-tracking-detail-info></tsl-transaction-tracking-detail-info>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithoutCaret = Template.bind({});
WithoutCaret.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: false,
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  imageSrc: null,
  defaultSvgSrc: '/assets/icons/joke.svg',
  showCaret: true,
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  title: 'Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  subtitle: 'Subtitle',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithLongDescription = Template.bind({});
WithLongDescription.args = {
  title: 'Title',
  subtitle: 'Subtitleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithRoundedImage = Template.bind({});
WithRoundedImage.args = {
  title: 'Title',
  subtitle: 'Subtitle',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
  isRoundedImage: true,
};
