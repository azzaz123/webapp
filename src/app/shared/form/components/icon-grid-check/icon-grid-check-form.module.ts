import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridCheckFormComponent } from './icon-grid-check-form.component';
import { IconCheckBoxModule } from './icon-check-box/icon-check-box.module';

@NgModule({
  declarations: [IconGridCheckFormComponent],
  exports: [IconGridCheckFormComponent],
  imports: [CommonModule, IconCheckBoxModule],
})
export class IconGridCheckFormModule {}
