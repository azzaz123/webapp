import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from './svg-icon/svg-icon.component';
import { SvgService } from './svg.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SvgService
  ],
  declarations: [
    SvgIconComponent
  ],
  exports: [
    SvgIconComponent
  ]
})
export class SvgIconModule { }
