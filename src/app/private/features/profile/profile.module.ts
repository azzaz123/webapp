import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbButtonsModule, NgbCarouselModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SharedModule } from '@shared/shared.module';
import { ChangeStoreLocationModal } from './modal/change-store-location-modal/change-store-location-modal.component';
import { UnsubscribeModalComponent } from './modal/unsubscribe-modal/unsubscribe-modal.component';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { VerificationEmailThanksModalComponent } from './modal/verification-email-thanks-modal/verification-email-thanks-modal.component';
import { VerificationsNSecurityTrackingEventsService } from './services/verifications-n-security-tracking-events.service';
import { EmailVerificationModule } from './modal/email-verification/email-verification.module';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbButtonsModule,
    GeolocationModule,
    NgbCarouselModule,
    NgbAccordionModule,
    NgbModalModule,
    CustomCurrencyModule,
    EmailVerificationModule,
  ],
  declarations: [profileRoutedComponents, UnsubscribeModalComponent, ChangeStoreLocationModal, VerificationEmailThanksModalComponent],
  providers: [VerificationsNSecurityTrackingEventsService],
})
export class ProfileModule {}
