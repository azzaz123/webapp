import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { ProBadgeComponent } from './pro-badge.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  declarations: [
    ProBadgeComponent
  ],
  exports: [
    ProBadgeComponent
  ]
})
export class ProBadgeModule { }
