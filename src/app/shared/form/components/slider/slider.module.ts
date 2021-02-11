import { NgModule } from '@angular/core';
import { SliderComponent } from './slider.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, NgxSliderModule, ReactiveFormsModule],
  exports: [SliderComponent],
  declarations: [SliderComponent],
})
export class SliderModule {}
