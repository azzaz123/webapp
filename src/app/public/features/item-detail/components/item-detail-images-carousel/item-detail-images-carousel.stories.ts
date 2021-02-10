import { Story, Meta } from '@storybook/angular/types-6-0';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ItemDetailImagesCarouselComponent } from './item-detail-images-carousel.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SlidesCarouselModule } from '@public/shared/components/slides-carousel/slides-carousel.module';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from '@shared/button/button.module';
import { CommonModule } from '@angular/common';

export default {
  title: 'Webapp/Public/Features/ItemDetail/Components/ItemDetailImagesCarousel',
  component: ItemDetailImagesCarouselComponent,
} as Meta;

const Template: Story<ItemDetailImagesCarouselComponent> = (args: ItemDetailImagesCarouselComponent) => ({
  component: ItemDetailImagesCarouselComponent,
  props: args,
  moduleMetadata: {
    declarations: [ItemDetailImagesCarouselComponent],
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
