import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemAvatarComponent } from './item-avatar.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [ItemAvatarComponent],
  imports: [CommonModule, SvgIconModule, SanitizedBackgroundModule, NgxPermissionsModule.forChild()],
  exports: [ItemAvatarComponent],
})
export class ItemAvatarModule {}
