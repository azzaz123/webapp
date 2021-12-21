import { NgModule } from '@angular/core';
import { UserVerificationsModule } from '@api/user-verifications/user-verifications.module';
import { SharedModule } from '@shared/shared.module';
import { VerificationCardComponent } from './components/verification-card/verification-card.component';
import { VerificationsNSecurityStore } from './services/verifications-n-security-store.service';
import { VerificationsNScurityRoutedComponents, VerificationsNScurityRoutingModule } from './verifications-n-security.routing.module';

@NgModule({
  imports: [SharedModule, VerificationsNScurityRoutingModule, UserVerificationsModule],
  declarations: [VerificationsNScurityRoutedComponents, VerificationCardComponent],
  providers: [VerificationsNSecurityStore],
})
export class VerificationsNScurityModule {}
