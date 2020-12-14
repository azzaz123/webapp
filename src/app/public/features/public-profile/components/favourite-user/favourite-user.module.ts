import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteUserComponent } from './favourite-user.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  declarations: [FavouriteUserComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [FavouriteUserComponent],
})
export class FavouriteUserModule {}
