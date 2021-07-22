import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StepperComponent } from './stepper.component';
import { StepDirective } from './step.directive';

@NgModule({
  declarations: [StepperComponent, StepDirective],
  imports: [CommonModule],
  exports: [StepperComponent, StepDirective],
})
export class StepperModule {}
