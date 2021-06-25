import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { CreditCardInfoComponent } from './credit-card-info.component';

@NgModule({
  exports: [CreditCardInfoComponent],
  imports: [CommonModule, SvgIconModule],
  declarations: [CreditCardInfoComponent],
})
export class CreditCardInfoModule {}
