import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditPriceBannerComponent } from './edit-price-banner.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { ButtonModule } from '@shared/button/button.module';
import { BannerModule } from '@shared/banner/banner.module';

@NgModule({
  declarations: [EditPriceBannerComponent],
  imports: [CommonModule, ButtonModule, SvgIconModule, BannerModule],
  exports: [EditPriceBannerComponent],
})
export class EditPriceBannerModule {}
