import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BannerModule } from '@shared/banner/banner.module';
import { ButtonModule } from '@shared/button/button.module';
import { SharedErrorActionComponent } from '@shared/error-action/components/error-action/shared-error-action.component';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [SharedErrorActionComponent],
  imports: [BannerModule, ButtonModule, CommonModule, SvgIconModule],
  exports: [SharedErrorActionComponent],
})
export class SharedErrorActionModule {}
