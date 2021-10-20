import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbButtonsModule, NgbCarouselModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SharedModule } from '@shared/shared.module';
import { BecomeProModalComponent } from './modal/become-pro-modal/become-pro-modal.component';
import { ChangeStoreLocationModal } from './modal/change-store-location-modal/change-store-location-modal.component';
import { UnsubscribeModalComponent } from './modal/unsubscribe-modal/unsubscribe-modal.component';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { EmailVerificationModalComponent } from './modal/email-verification-modal/email-verification-modal.component';
import { VerificationEmailThanksModalComponent } from './modal/verification-email-thanks-modal/verification-email-thanks-modal.component';
import { VerificationsNSecurityTrackingEventsService } from './services/verifications-n-security-tracking-events.service';

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
  ],
  declarations: [
    profileRoutedComponents,
    UnsubscribeModalComponent,
    BecomeProModalComponent,
    ChangeStoreLocationModal,
    EmailVerificationModalComponent,
    VerificationEmailThanksModalComponent,
  ],
  providers: [VerificationsNSecurityTrackingEventsService],
})
export class ProfileModule {}
