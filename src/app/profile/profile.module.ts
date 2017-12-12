import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';
import { CoreModule } from '../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule,
    CoreModule
  ],
  declarations: [
    profileRoutedComponents
  ]
})
export class ProfileModule { }
