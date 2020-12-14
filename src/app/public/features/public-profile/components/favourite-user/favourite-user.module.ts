import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavouriteUserComponent } from './favourite-user.component';
import { FavouriteIconModule } from '@public/core/components/favourite-icon/favourite-icon.module';

@NgModule({
  declarations: [FavouriteUserComponent],
  imports: [CommonModule, FavouriteIconModule],
  exports: [FavouriteUserComponent],
})
export class FavouriteUserModule {}
