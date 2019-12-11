import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileBlockerComponent } from './mobile-blocker.component';
import { MatIconModule } from '@angular/material';

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
