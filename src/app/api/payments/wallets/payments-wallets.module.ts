import { NgModule } from '@angular/core';
import { PaymentsWalletsHttpService } from './http/payments-wallets-http.service';
import { PaymentsWalletsService } from './payments-wallets.service';

@NgModule({
  providers: [PaymentsWalletsService, PaymentsWalletsHttpService],
})
export class PaymentsWalletsModule {}
