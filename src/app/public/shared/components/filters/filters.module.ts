import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractFilterComponent } from './components/abstract-filter/abstract-filter.component';
import { BubbleModule } from '@public/shared/components/bubble/bubble.module';

@NgModule({
  declarations: [AbstractFilterComponent],
  imports: [CommonModule, BubbleModule],
})
export class FiltersModule {}
