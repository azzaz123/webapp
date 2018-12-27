import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MatIconModule } from '@angular/material';
import { ProfileService } from './profile.service';
import { HaversineService } from 'ng2-haversine';

@NgModule({
  imports: [
    SharedModule,
    MatIconModule
  ],
  providers: [
    ProfileService,
    HaversineService
  ]
})
export class ProfileModule { }
