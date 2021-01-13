import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ItemImagesComponent } from './item-images.component';

export default {
  title: 'Webapp/ImagesCarousel',
  component: ItemImagesComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="max-width: 520px">${story.template}</div>`,
      };
    },
  ],
  argTypes: { toggleFavourite: { action: 'toggleFavourite' } },
} as Meta;

const Template: Story<ItemImagesComponent> = (args: ItemImagesComponent) => ({
  component: ItemImagesComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemImagesComponent],
    imports: [CommonModule, NgbCarouselModule, ImageFallbackModule],
    providers: [],
  },
  template: '<tsl-item-images [images]="images"></tsl-item-images>',
});

export const Default = Template.bind({});
Default.args = {
  images: ['', ''],
};

export const WithoutImages = Template.bind({});
WithoutImages.args = {
  images: null,
};
