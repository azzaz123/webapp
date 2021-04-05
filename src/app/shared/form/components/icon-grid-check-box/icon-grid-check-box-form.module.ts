import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridCheckBoxFormComponent } from './icon-grid-check-box-form.component';
import { IconCheckBoxModule } from './icon-check-box/icon-check-box.module';

@NgModule({
  declarations: [IconGridCheckBoxFormComponent],
  exports: [IconGridCheckBoxFormComponent],
  imports: [CommonModule, IconCheckBoxModule],
})
export class IconGridCheckBoxFormModule {}
