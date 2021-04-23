import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { AbstractFilterModule } from '../abstract-filter/abstract-filter.module';
import { ToggleFilterComponent } from './toggle-filter.component';
import { IsBubblePipe } from '@public/shared/components/filters/components/abstract-filter/pipes/is-bubble.pipe';

@NgModule({
  declarations: [ToggleFilterComponent, IsBubblePipe],
  imports: [CommonModule, AbstractFilterModule, ToggleFormModule, FormsModule],
  exports: [ToggleFilterComponent, IsBubblePipe],
})
export class ToggleFilterModule {}
