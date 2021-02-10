import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';
import { ITEM_BUMP_FLAGS, ITEM_FLAGS } from '@fixtures/item.fixtures.spec';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SlidesCarouselModule } from '../slides-carousel/slides-carousel.module';
import { ItemFlagModule } from '../item-flag/item-flag.module';
import { ItemImagesCarouselComponent } from './item-images-carousel.component';

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
    providers: [HAMMER_PROVIDER],
  },
  template: '<tsl-item-images-carousel [itemFlags]="itemFlags" [itemVisibilityFlags]="itemVisibilityFlags"></tsl-item-images-carousel>',
});

const imagesURL = ['http://localhost:6006/images/item-camera.jpg', 'http://localhost:6006/images/item-pc.jpg'];

export const Bumped = Template.bind({});
Bumped.args = {
  // images: imagesURL,
  itemVisibilityFlags: { ...ITEM_BUMP_FLAGS, bumped: true },
};

export const CountryBumped = Template.bind({});
CountryBumped.args = {
  // images: imagesURL,
  itemVisibilityFlags: { ...ITEM_BUMP_FLAGS, bumped: true, country_bumped: true },
};

export const Sold = Template.bind({});
Sold.args = {
  // images: imagesURL,
  itemFlags: { ...ITEM_FLAGS, sold: true },
};

export const Reserved = Template.bind({});
Reserved.args = {
  // images: imagesURL,
  itemFlags: { ...ITEM_FLAGS, reserved: true },
};

export const Expired = Template.bind({});
Expired.args = {
  // images: imagesURL,
  itemFlags: { ...ITEM_FLAGS, expired: true },
};

export const Inactive = Template.bind({});
Inactive.args = {
  // images: imagesURL,
  itemFlags: { ...ITEM_FLAGS, onhold: true },
};

export const TwoFlags = Template.bind({});
TwoFlags.args = {
  // images: imagesURL,
  itemFlags: { ...ITEM_FLAGS, reserved: true },
  itemVisibilityFlags: { ...ITEM_BUMP_FLAGS, bumped: true },
};
