import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SocialShareService } from '@core/social-share/social-share.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { SocialShareComponent } from './social-share.component';

@NgModule({
  declarations: [SocialShareComponent],
  exports: [SocialShareComponent],
  imports: [CommonModule, SvgIconModule],
  providers: [SocialShareService],
})
export class SocialShareModule {}
