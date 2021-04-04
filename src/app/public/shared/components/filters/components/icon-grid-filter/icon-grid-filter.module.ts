import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridFilterComponent } from './icon-grid-filter.component';
import { IconGridCheckFormModule } from '@shared/form/components/icon-grid-check/icon-grid-check-form.module';

@NgModule({
  declarations: [IconGridFilterComponent],
  exports: [IconGridFilterComponent],
  imports: [CommonModule, IconGridCheckFormModule],
})
export class IconGridFilterModule {}
