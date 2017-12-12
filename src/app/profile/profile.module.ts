import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { profileRoutedComponents, ProfileRoutingModule } from './profile.routes';

@NgModule({
  imports: [
    CommonModule,
    ProfileRoutingModule
  ],
  declarations: [
    profileRoutedComponents
  ]
})
export class ProfileModule { }
