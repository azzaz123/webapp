import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { SpinnerComponent } from './spinner.component';

@NgModule({
  imports: [SvgIconModule],
  declarations: [SpinnerComponent],
  exports: [SpinnerComponent],
})
export class SpinnerModule {}
