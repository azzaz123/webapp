import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material';
import { ProBadgeComponent } from './pro-badge.component';
import { UserService } from '../../core/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule
  ],
  providers: [
    UserService
  ],
  declarations: [
    ProBadgeComponent
  ],
  exports: [
    ProBadgeComponent
  ]
})
export class ProBadgeModule { }
