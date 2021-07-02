import { NgModule } from '@angular/core';
import { WalletRoutedComponents, WalletRoutingModule } from './wallet.routing.module';

@NgModule({
  imports: [WalletRoutingModule],
  declarations: [WalletRoutedComponents],
})
export class WalletModule {}
