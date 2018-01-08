import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { NgUploaderModule } from 'ngx-uploader';
import { EditEmailComponent } from './edit-email/edit-email.component';
import { EmailModalComponent } from './edit-email/email-modal/email-modal.component';
import { EditPasswordComponent } from './edit-password/edit-password.component';
import { PasswordModalComponent } from './edit-password/password-modal/password-modal.component';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    FormsModule,
    MdIconModule,
    NgbButtonsModule,
    GeolocationModule,
    NgUploaderModule
  ],
  declarations: [
    profileRoutedComponents,
    EditEmailComponent,
    EmailModalComponent,
    EditPasswordComponent,
    PasswordModalComponent
  ],
  entryComponents: [
    EmailModalComponent,
    PasswordModalComponent
  ]
})
export class ProfileModule { }
