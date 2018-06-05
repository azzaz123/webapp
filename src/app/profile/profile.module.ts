import { NgModule } from '@angular/core';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { NgUploaderModule } from 'ngx-uploader';
import { SharedModule } from '../shared/shared.module';
import { EditEmailComponent } from './edit-email/edit-email.component';
import { EmailModalComponent } from './edit-email/email-modal/email-modal.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { PasswordModalComponent } from './edit-password/password-modal/password-modal.component';
import { UnsubscribeModalComponent } from './unsubscribe-modal/unsubscribe-modal.component';
import { PictureUploadComponent } from './picture-upload/picture-upload.component';
import { ProfileFormComponent } from './profile-form/profile-form.component';
import { VisibilityProductsModalComponent } from './profile-pro/profile-pro-subscription/visibility-products-modal/visibility-products-modal.component';
import { SubscriptionIconPipe } from './profile-pro/profile-pro-subscription/subscription-icon.pipe';
import { DeleteInfoConfirmationModalComponent } from './profile-pro/profile-pro-billing/delete-info-confirmation-modal/delete-info-confirmation-modal.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    NgbButtonsModule,
    GeolocationModule,
    NgUploaderModule
  ],
  declarations: [
    profileRoutedComponents,
    EditEmailComponent,
    EmailModalComponent,
    EditPasswordComponent,
    PasswordModalComponent,
    UnsubscribeModalComponent,
    PictureUploadComponent,
    ProfileFormComponent,
    VisibilityProductsModalComponent,
    SubscriptionIconPipe,
    DeleteInfoConfirmationModalComponent
  ],
  entryComponents: [
    EmailModalComponent,
    PasswordModalComponent,
    UnsubscribeModalComponent,
    VisibilityProductsModalComponent
  ]
})
export class ProfileModule { }
