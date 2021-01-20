import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterSpecificationComponent } from './counter-specification.component';

@NgModule({
  declarations: [CounterSpecificationComponent],
  imports: [CommonModule],
  exports: [CounterSpecificationComponent],
})
export class CounterSpecificationModule {}
