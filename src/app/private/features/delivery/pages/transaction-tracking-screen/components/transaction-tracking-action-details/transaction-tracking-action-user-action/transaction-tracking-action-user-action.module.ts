import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionTrackingActionUserActionComponent } from './transaction-tracking-action-user-action.component';
import { ErrorsService } from '@core/errors/errors.service';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [TransactionTrackingActionUserActionComponent],
  imports: [CommonModule, RouterModule],
  exports: [TransactionTrackingActionUserActionComponent],
  providers: [ErrorsService],
})
export class TransactionTrackingActionUserActionModule {}
