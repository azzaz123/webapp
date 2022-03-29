import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from '@shared/button/button.module';
import { PayviewBuyOverviewComponent } from './components/overview/payview-buy-overview.component';

@NgModule({
  imports: [CommonModule, ButtonModule],
  declarations: [PayviewBuyOverviewComponent],
  exports: [PayviewBuyOverviewComponent],
})
export class PayviewBuyModule {}
