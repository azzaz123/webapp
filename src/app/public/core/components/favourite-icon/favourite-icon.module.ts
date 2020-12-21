import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteIconComponent } from './favourite-icon.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [FavouriteIconComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [FavouriteIconComponent],
})
export class FavouriteIconModule {}
