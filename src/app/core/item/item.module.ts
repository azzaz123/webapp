import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar/item-avatar.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ItemAvatarComponent
  ],
  declarations: [ItemAvatarComponent]
})
export class ItemModule { }
