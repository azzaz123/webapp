import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { ProBadgeComponent } from './pro-badge.component';
import { SvgIconModule } from 'app/core/svg-icon/svg-icon.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    SvgIconModule
  ],
  declarations: [
    ProBadgeComponent
  ],
  exports: [
    ProBadgeComponent
  ]
})
export class ProBadgeModule { }
