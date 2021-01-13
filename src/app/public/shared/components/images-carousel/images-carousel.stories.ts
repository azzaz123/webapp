import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { Story, Meta } from '@storybook/angular/types-6-0';
import { ImagesCarouselComponent } from './images-carousel.component';

export default {
  title: 'Webapp/Public/Shared/ImagesCarousel',
  component: ImagesCarouselComponent,
  decorators: [
    (storyFunc) => {
      const story = storyFunc();

      return {
        ...story,
        template: `<div style="max-width: 520px">${story.template}</div>`,
      };
    },
  ],
} as Meta;

const Template: Story<ImagesCarouselComponent> = (
  args: ImagesCarouselComponent
) => ({
  component: ImagesCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [ImagesCarouselComponent],
    imports: [CommonModule, NgbCarouselModule, ImageFallbackModule],
    providers: [],
  },
  template: '<tsl-images-carousel [images]="images"></tsl-images-carousel>',
});

const imageURL =
  'http://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320';

export const Default = Template.bind({});
Default.args = {
  images: [imageURL, imageURL],
};

export const WithoutImages = Template.bind({});
WithoutImages.args = {
  images: null,
};
