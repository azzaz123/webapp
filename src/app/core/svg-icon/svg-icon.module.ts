import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { SvgService } from './svg.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [CommonModule, HttpClientModule],
  providers: [SvgService],
  declarations: [SvgIconComponent],
  exports: [SvgIconComponent],
})
export class SvgIconModule {}
