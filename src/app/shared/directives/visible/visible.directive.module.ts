import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisibleDirective } from './visible.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [VisibleDirective],
  exports: [VisibleDirective],
})
export class VisibleDirectiveModule {}
