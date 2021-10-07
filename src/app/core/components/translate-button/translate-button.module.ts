import { NgModule } from '@angular/core';
import { TranslateButtonComponent } from '@core/components/translate-button/translate-button.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [SvgIconModule, CommonModule],
  declarations: [TranslateButtonComponent],
  exports: [TranslateButtonComponent],
})
export class TranslateButtonModule {}
