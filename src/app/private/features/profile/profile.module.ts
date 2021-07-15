import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbAccordionModule, NgbButtonsModule, NgbCarouselModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CustomCurrencyModule } from '@shared/pipes/custom-currency/custom-currency.module';
import { SharedModule } from '@shared/shared.module';
import { BecomeProModalComponent } from './modal/become-pro-modal/become-pro-modal.component';
import { UnsubscribeModalComponent } from './modal/unsubscribe-modal/unsubscribe-modal.component';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';

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
  declarations: [profileRoutedComponents, UnsubscribeModalComponent, BecomeProModalComponent],
})
export class ProfileModule {}
