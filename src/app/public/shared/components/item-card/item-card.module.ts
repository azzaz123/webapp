import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCardComponent } from './item-card.component';
import { ItemCardPlaceholderComponent } from './components/item-card-placeholder/item-card-placeholder.component';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FavouriteIconModule } from '@public/shared/components/favourite-icon/favourite-icon.module';
import { ImageFallbackModule } from '@public/core/directives/image-fallback/image-fallback.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ItemCardComponent, ItemCardPlaceholderComponent],
  imports: [CommonModule, FavouriteIconModule, CustomCurrencyModule, SvgIconModule, ImageFallbackModule, NgxPermissionsModule.forChild()],
  exports: [ItemCardComponent, ItemCardPlaceholderComponent],
})
export class ItemCardModule {}
