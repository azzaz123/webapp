import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MdIconModule } from '@angular/material';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import { GeolocationModule } from '../shared/geolocation/geolocation.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule,
    ReactiveFormsModule,
    MdIconModule,
    NgbButtonsModule,
    GeolocationModule
  ],
  declarations: [
    profileRoutedComponents
  ]
})
export class ProfileModule { }
