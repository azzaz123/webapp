import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { FooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  exports: [FooterComponent],
  declarations: [FooterComponent],
  providers: [],
})
export class FooterModule {}
