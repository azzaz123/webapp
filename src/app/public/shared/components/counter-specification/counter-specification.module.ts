import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CounterSpecificationComponent } from './counter-specification.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [CounterSpecificationComponent],
  imports: [CommonModule, SvgIconModule],
  exports: [CounterSpecificationComponent],
})
export class CounterSpecificationModule {}
