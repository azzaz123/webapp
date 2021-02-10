import { CommonModule } from '@angular/common';
import { HammerModule } from '@angular/platform-browser';
import { HAMMER_PROVIDER } from '@core/hammerjs/hammerjs-provider';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { SlidesCarouselComponent } from './slides-carousel.component';

export default {
  title: 'Webapp/Public/Shared/Components/SlidesCarousel',
  component: SlidesCarouselComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="max-width: 520px; height:300px">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<SlidesCarouselComponent> = (args: SlidesCarouselComponent) => ({
  component: SlidesCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [SlidesCarouselComponent],
    imports: [CommonModule, NgbCarouselModule, ImageFallbackModule, HammerModule],
    providers: [HAMMER_PROVIDER],
  },
  template: '<tsl-slides-carousel></tsl-slides-carousel>',
});

const imagesURL = ['http://localhost:6006/images/item-camera.jpg', 'http://localhost:6006/images/item-pc.jpg'];
export const Default = Template.bind({});
Default.args = {
  // images: imagesURL,
};

export const OneImage = Template.bind({});
OneImage.args = {
  // images: [imagesURL[0]],
};

export const WithoutImages = Template.bind({});
WithoutImages.args = {
  // images: null,
};
