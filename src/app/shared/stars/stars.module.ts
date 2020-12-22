import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StarsComponent } from './stars.component';

@NgModule({
  imports: [CommonModule],
  declarations: [StarsComponent],
  exports: [StarsComponent],
})
export class StarsModule {}
