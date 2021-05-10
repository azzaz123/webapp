import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MobileBlockerComponent } from './mobile-blocker.component';

@NgModule({
  imports: [CommonModule, SvgIconModule],
  declarations: [MobileBlockerComponent],
  exports: [MobileBlockerComponent],
})
export class MobileBlockerModule {}
