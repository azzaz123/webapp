import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { FavoriteSearchButtonComponent } from './favorite-search-button.component';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [FavoriteSearchButtonComponent],
  exports: [FavoriteSearchButtonComponent],
})
export class FavoriteSearchButtonModule {}
