import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DateCountDownComponent } from './date-countdown.component';

@NgModule({
  exports: [DateCountDownComponent],
  imports: [CommonModule],
  declarations: [DateCountDownComponent],
})
export class DateCountDownModule {}
