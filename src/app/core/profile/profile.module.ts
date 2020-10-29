import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService } from './profile.service';
import { HaversineService } from 'ng2-haversine';

@NgModule({
  imports: [
    SharedModule,
  ],
  providers: [
    ProfileService,
    HaversineService
  ]
})
export class ProfileModule { }
