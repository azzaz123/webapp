import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { I18nService } from '@core/i18n/i18n.service';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ConfirmationModalComponent],
  imports: [CommonModule, NgbModalModule],
  exports: [ConfirmationModalComponent],
  providers: [I18nService],
})
export class ConfirmationModalModule {}
