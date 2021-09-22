import { NgModule } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { VerificationsNScurityRoutedComponents, VerificationsNScurityRoutingModule } from './verifications-n-security.routing.module';

@NgModule({
  imports: [SharedModule, VerificationsNScurityRoutingModule],
  declarations: [VerificationsNScurityRoutedComponents],
})
export class VerificationsNScurityModule {}
