import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonModule } from '@shared/button/button.module';
import { ConfirmationModalV2Component } from './confirmation-modal-v2.component';

@NgModule({
  imports: [SvgIconModule],
  declarations: [ConfirmationModalV2Component],
  providers: [NgbActiveModal, ButtonModule],
})
export class ConfirmationModalV2Module {}
