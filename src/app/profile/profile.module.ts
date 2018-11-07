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
    UnsubscribeModalComponent,
    ProfileSubscriptionComponent,
    ProfileInfoComponent
  ],
  entryComponents: [
    UnsubscribeModalComponent
  ]
})
export class ProfileModule { }
