import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WalletOverviewRoutedComponents, WalletOverviewRoutingModule } from './wallet-overview.routing.module';

@NgModule({
  declarations: [WalletOverviewRoutedComponents],
  imports: [WalletOverviewRoutingModule, CommonModule],
})
export class WalletOverviewModule {}
