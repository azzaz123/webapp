import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarsComponent } from './stars/stars.component';
import { SanitizedBackgroundDirective } from './sanitized-background/sanitized-background.directive';
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
    SanitizedBackgroundDirective,
    SpinnerComponent
  ],
  declarations: [
    StarsComponent,
    SanitizedBackgroundDirective,
    SpinnerComponent
  ]
})
export class SharedModule { }
