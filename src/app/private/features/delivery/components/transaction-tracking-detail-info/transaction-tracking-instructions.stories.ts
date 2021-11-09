import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { styledWrapperDecorator } from '@stories/decorators/styled-wrapper/styled-wrapper.decorator';
import { TransactionTrackingDetailInfoComponent } from '@private/features/delivery/components/transaction-tracking-detail-info/transaction-tracking-detail-info.component';
import { HttpClientModule } from '@angular/common/http';

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
    imports: [CommonModule, SvgIconModule, HttpClientModule],
  },
  template:
    '<tsl-transaction-tracking-detail-info [title]="title" [subtitle]="subtitle" [imageSrc]="imageSrc" [showCaret]="showCaret" [fallbackSvgSrc]="fallbackSvgSrc" [isRoundedImage]="isRoundedImage"></tsl-transaction-tracking-detail-info>',
});

export const Default = Template.bind({});
Default.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
};

export const WithCaret = Template.bind({});
WithCaret.args = {
  title: 'Producto:',
  subtitle: 'Altavoces B&WG',
  imageSrc: 'http://localhost:6006/images/item-camera.jpg',
  showCaret: true,
};

export const WithoutImage = Template.bind({});
WithoutImage.args = {
  title: 'Vendido por:',
  subtitle: 'Lalli López',
  imageSrc: null,
  fallbackSvgSrc: '/assets/icons/joke.svg',
  showCaret: true,
};

export const WithLongTitle = Template.bind({});
WithLongTitle.args = {
  title: 'Titleeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
  subtitle: 'Altavoces B&WG',
  fallbackSvgSrc: '/assets/icons/shield_verified.svg',
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
