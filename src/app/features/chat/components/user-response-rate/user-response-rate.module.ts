import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserResponseRateComponent } from './user-response-rate.component';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [UserResponseRateComponent],
  exports: [UserResponseRateComponent],
})
export class UserResponseRateModule {}
