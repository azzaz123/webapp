import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';
import { NgUploaderModule } from 'ngx-uploader';

@NgModule({
  imports: [
    CommonModule,
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
