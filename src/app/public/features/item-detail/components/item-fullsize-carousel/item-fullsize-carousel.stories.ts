import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ItemFullSizeCarouselComponent } from './item-fullsize-carousel.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SlidesCarouselModule } from '@public/shared/components/slides-carousel/slides-carousel.module';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@shared/button/button.module';
import { CommonModule } from '@angular/common';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/ItemDetailImagesCarousel',
  component: ItemFullSizeCarouselComponent,
} as Meta;

const Template: Story<ItemFullSizeCarouselComponent> = (args: ItemFullSizeCarouselComponent) => ({
  component: ItemFullSizeCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemFullSizeCarouselComponent],
    imports: [SvgIconModule, SlidesCarouselModule, HttpClientModule, FavouriteIconModule, ButtonModule, CommonModule],
    providers: [],
  },
  template: '<tsl-item-detail-images-carousel [images]="images"></tsl-item-detail-images-carousel>',
});

const imagesURL = ['http://localhost:6006/images/item-camera.jpg', 'http://localhost:6006/images/item-pc.jpg'];
export const Default = Template.bind({});
Default.args = {
  images: imagesURL,
};
