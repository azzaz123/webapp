import { NgModule } from '@angular/core';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { SharedModule } from '../shared/shared.module';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { ProfileSubscriptionComponent } from './profile-subscription/profile-subscription.component';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { BecomeProModalComponent } from './become-pro-modal/become-pro-modal.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgbButtonsModule,
    GeolocationModule
  ],
  declarations: [
    profileRoutedComponents,
    BecomeProModalComponent,
    UnsubscribeModalComponent,
    ProfileSubscriptionComponent,
    ProfileInfoComponent,
    AccountComponent
  ],
  entryComponents: [
    UnsubscribeModalComponent,
    BecomeProModalComponent
  ]
})
export class ProfileModule { }
