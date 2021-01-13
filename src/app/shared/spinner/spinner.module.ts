import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { ReviewItemModule } from '@features/reviews/components/review-item/review-item.module';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  imports: [SvgIconModule],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
