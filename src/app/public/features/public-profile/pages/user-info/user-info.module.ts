import { NgModule } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { UserResponseRateModule } from '@features/chat/components/user-response-rate/user-response-rate.module';
import { UserInfoComponent } from './user-info.component';
import { GeolocationModule } from '@shared/geolocation/geolocation.module';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [UserInfoComponent],
  imports: [
    CommonModule,
    SvgIconModule,
    GeolocationModule,
    UserResponseRateModule,
  ],
  exports: [UserInfoComponent],
})
export class UserInfoModule {}
