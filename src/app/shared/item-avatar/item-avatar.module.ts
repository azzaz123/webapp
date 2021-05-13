import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';

@NgModule({
  declarations: [ItemAvatarComponent],
  imports: [CommonModule, SvgIconModule, SanitizedBackgroundModule],
  exports: [ItemAvatarComponent],
})
export class ItemAvatarModule {}
