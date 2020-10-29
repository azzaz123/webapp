import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileBlockerComponent } from './mobile-blocker.component';
import { SvgIconModule } from '../svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [
    MobileBlockerComponent
  ],
  exports: [
    MobileBlockerComponent
  ]
})
export class MobileBlockerModule { }
