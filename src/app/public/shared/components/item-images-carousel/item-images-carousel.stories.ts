import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SlidesCarouselModule } from '@shared/components/carousel-slides/carousel-slides.module';
import { ItemFlagModule } from '../item-flag/item-flag.module';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { BUMPED_ITEM_FLAG_TYPES, STATUS_ITEM_FLAG_TYPES } from '../item-flag/item-flag-constants';

export default {
  title: 'Webapp/Public/Shared/Components/ItemImagesCarousel',
  component: ItemImagesCarouselComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="width: 600px; height: 350px; position:relative;">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<ItemImagesCarouselComponent> = (args: ItemImagesCarouselComponent) => ({
  component: ItemImagesCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemImagesCarouselComponent],
    imports: [CommonModule, HammerModule, ItemFlagModule, SlidesCarouselModule, HttpClientModule],
    providers: [HAMMER_PROVIDER, DeviceDetectorService],
  },
  template:
    '<tsl-item-images-carousel [isExpired]="isExpired" [images]="images" [statusFlag]="statusFlag" [bumpedFlag]="bumpedFlag"></tsl-item-images-carousel>',
});

const imagesURL = ['http://localhost:6006/images/item-camera.jpg', 'http://localhost:6006/images/item-pc.jpg'];

export const Bumped = Template.bind({});
Bumped.args = {
  images: imagesURL,
  isExpired: false,
  bumpedFlag: BUMPED_ITEM_FLAG_TYPES.BUMPED,
};

export const CountryBumped = Template.bind({});
CountryBumped.args = {
  images: imagesURL,
  isExpired: false,
  bumpedFlag: BUMPED_ITEM_FLAG_TYPES.COUNTRY_BUMP,
};

export const Sold = Template.bind({});
Sold.args = {
  images: imagesURL,
  isExpired: false,
  statusFlag: STATUS_ITEM_FLAG_TYPES.SOLD,
};

export const Reserved = Template.bind({});
Reserved.args = {
  images: imagesURL,
  isExpired: false,
  statusFlag: STATUS_ITEM_FLAG_TYPES.RESERVED,
};

export const Expired = Template.bind({});
Expired.args = {
  images: imagesURL,
  isExpired: true,
  statusFlag: STATUS_ITEM_FLAG_TYPES.EXPIRED,
};

export const Inactive = Template.bind({});
Inactive.args = {
  images: imagesURL,
  isExpired: false,
  statusFlag: STATUS_ITEM_FLAG_TYPES.INACTIVE,
};

export const TwoFlags = Template.bind({});
TwoFlags.args = {
  images: imagesURL,
  isExpired: false,
  statusFlag: STATUS_ITEM_FLAG_TYPES.RESERVED,
  bumpedFlag: BUMPED_ITEM_FLAG_TYPES.BUMPED,
};
