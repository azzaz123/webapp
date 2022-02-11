import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericImageComponent } from './generic-image.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { NgxPermissionsModule } from 'ngx-permissions';

@NgModule({
  declarations: [GenericImageComponent],
  imports: [CommonModule, SvgIconModule, SanitizedBackgroundModule, NgxPermissionsModule.forChild()],
  exports: [GenericImageComponent],
})
export class GenericImageModule {}
