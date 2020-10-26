import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MobileBlockerComponent } from './mobile-blocker.component';
import { MatIconModule } from '@angular/material';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    SharedModule
  ],
  declarations: [
    MobileBlockerComponent
  ],
  exports: [
    MobileBlockerComponent
  ]
})
export class MobileBlockerModule { }
