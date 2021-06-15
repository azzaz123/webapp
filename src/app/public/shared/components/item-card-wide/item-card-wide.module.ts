import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardWideComponent } from './item-card-wide.component';
import { ItemCardWidePlaceholderComponent } from './components/item-card-wide-placeholder/item-card-wide-placeholder.component';
import { FavouriteIconModule } from '../favourite-icon/favourite-icon.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SlidesCarouselModule } from '../carousel-slides/carousel-slides.module';
import { ItemExtraInfoModule } from '@public/shared/components/item-extra-info/item-extra-info.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ItemCardWideComponent, ItemCardWidePlaceholderComponent],
  imports: [
    CommonModule,
    FavouriteIconModule,
    CustomCurrencyModule,
    SlidesCarouselModule,
    ItemExtraInfoModule,
    SvgIconModule,
    NgxPermissionsModule.forChild(),
  ],
  exports: [ItemCardWideComponent, ItemCardWidePlaceholderComponent],
  providers: [DeviceDetectorService],
})
export class ItemCardWideModule {}
