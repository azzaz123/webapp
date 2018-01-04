import { NgModule } from '@angular/core';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { NgUploaderModule } from 'ngx-uploader';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    MdIconModule,
    NgbButtonsModule,
    GeolocationModule,
    NgUploaderModule
  ],
  declarations: [
    profileRoutedComponents
  ]
})
export class ProfileModule { }
