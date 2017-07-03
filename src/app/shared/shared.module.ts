import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './stars/stars.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    StarsComponent,
    SpinnerComponent
  ],
  declarations: [
    StarsComponent,
    SpinnerComponent
  ]
})
export class SharedModule { }
