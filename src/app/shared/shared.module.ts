import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SpinnerComponent } from './spinner/spinner.component';
import { MdIconModule } from '@angular/material';
import { AdComponent } from '../shared/ad/ad.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { CardModule } from './card/card.module';

@NgModule({
  imports: [
    CardModule,
    CommonModule,
    MdIconModule,
    NgbModule.forRoot()
  ],
  exports: [
    CardModule,
    CommonModule,
    SpinnerComponent,
    AdComponent
  ],
  declarations: [
    AdComponent,
    ConfirmationModalComponent,
    SpinnerComponent,
  ],
  entryComponents: [
    ConfirmationModalComponent
  ]
})
export class SharedModule { }
