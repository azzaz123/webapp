import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { PaymentsCardInfoComponent } from './payments-card-info.component';

@NgModule({
  exports: [PaymentsCardInfoComponent],
  imports: [CommonModule, SvgIconModule],
  declarations: [PaymentsCardInfoComponent],
})
export class PaymentsCardInfoModule {}
