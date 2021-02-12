import { NgModule } from '@angular/core';
import { SliderFormComponent } from './slider-form.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, NgxSliderModule, ReactiveFormsModule],
  exports: [SliderFormComponent],
  declarations: [SliderFormComponent],
})
export class SliderFormModule {}
