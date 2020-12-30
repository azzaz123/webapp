import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { MapItemService } from './services/map-item/map-item.service';
import { UserPublishedComponent } from './user-published.component';

@NgModule({
  imports: [CommonModule, SpinnerModule],
  declarations: [UserPublishedComponent],
  providers: [MapItemService],
  exports: [UserPublishedComponent],
})
export class UserPublishedModule {}
