import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopbarComponent } from './topbar/topbar.component';
import { MdIconModule } from '@angular/material';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UserModule } from '../core/user/user.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbDropdownModule,
    MdIconModule,
    UserModule
  ],
  exports: [
    TopbarComponent
  ],
  declarations: [TopbarComponent]
})
export class LayoutModule {
}
