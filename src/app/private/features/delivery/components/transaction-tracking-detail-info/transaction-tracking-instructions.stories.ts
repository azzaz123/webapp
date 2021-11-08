import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionTrackingDetailInfoComponent } from '@private/features/delivery/components/transaction-tracking-detail-info/transaction-tracking-detail-info.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export default {
  title: 'Webapp/Private/Features/Delivery/Components/TransactionTrackingDetailInfo',
  component: TransactionTrackingDetailInfoComponent,
  decorators: [styledWrapperDecorator('max-width: 375px;')],
} as Meta;

const Template: Story<TransactionTrackingDetailInfoComponent> = (args: TransactionTrackingDetailInfoComponent) => ({
  component: TransactionTrackingDetailInfoComponent,
  props: args,
  moduleMetadata: {
    declarations: [TransactionTrackingDetailInfoComponent],
    imports: [CommonModule, SvgIconModule, HttpClientTestingModule],
  },
  template:
    '<tsl-transaction-tracking-detail-info [title]="title" [subtitle]="subtitle" [imageSrc]="imageSrc" [showCaret]="showCaret" [defaultSvgSrc]="defaultSvgSrc" [isRoundedImage]="isRoundedImage"></tsl-transaction-tracking-detail-info>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithoutCaret = Template.bind({});
WithoutCaret.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: false,
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: null,
  defaultSvgSrc: '/assets/icons/joke.svg',
  showCaret: true,
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  title: 'Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithLongDescription = Template.bind({});
WithLongDescription.args = {
  title: 'Producto:',
  subtitle: 'Subtitleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithRoundedImage = Template.bind({});
WithRoundedImage.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
  isRoundedImage: true,
};
