import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileBlockerComponent } from './mobile-blocker.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MobileBlockerComponent
  ],
  exports: [
    MobileBlockerComponent
  ]
})
export class MobileBlockerModule { }
