import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';

import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';

@NgModule({
  imports: [
    CommonModule,
    MdIconModule,
    NgbModule.forRoot()
  ],
  exports: [
    CommonModule,
    ConfirmationModalComponent,
    SpinnerComponent
  ],
  declarations: [
    ConfirmationModalComponent,
    SpinnerComponent
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
