import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconGridFilterComponent } from './icon-grid-filter.component';
import { IconGridCheckFormModule } from '@shared/form/components/icon-grid-check/icon-grid-check-form.module';
import { AbstractFilterModule } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [IconGridFilterComponent],
  exports: [IconGridFilterComponent],
  imports: [CommonModule, IconGridCheckFormModule, AbstractFilterModule, ReactiveFormsModule],
})
export class IconGridFilterModule {}
