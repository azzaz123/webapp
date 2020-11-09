import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ProfileService } from './profile.service';

@NgModule({
  imports: [SharedModule],
  providers: [ProfileService],
})
export class ProfileModule {}
