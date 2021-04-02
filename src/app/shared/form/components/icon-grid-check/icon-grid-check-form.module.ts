import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridCheckFormComponent } from './icon-grid-check-form.component';
import { IconCheckModule } from './icon-check/icon-check.module';

@NgModule({
  declarations: [IconGridCheckFormComponent],
  exports: [IconGridCheckFormComponent],
  imports: [CommonModule, IconCheckModule],
})
export class IconGridCheckFormModule {}
