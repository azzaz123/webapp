import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { CommunicationsConsentRoutedComponents, CommunicationsConsentRoutingModule } from './communications-consent-routing.module';

@NgModule({
  imports: [SharedModule, FormsModule, ReactiveFormsModule, NgbButtonsModule, CommunicationsConsentRoutingModule],
  declarations: [CommunicationsConsentRoutedComponents],
})
export class CommunicationsConsentModule {}
