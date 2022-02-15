import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { ToggleFilterComponent } from './toggle-filter.component';

@NgModule({
  declarations: [ToggleFilterComponent],
  imports: [CommonModule, AbstractFilterModule, ToggleFormModule, FormsModule],
  exports: [ToggleFilterComponent],
})
export class ToggleFilterModule {}
