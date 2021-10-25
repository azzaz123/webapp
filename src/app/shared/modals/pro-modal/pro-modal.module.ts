import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProModalComponent } from './pro-modal.component';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';

@NgModule({
  declarations: [ProModalComponent],
  imports: [CommonModule, ButtonModule, SvgIconModule],
})
export class ProModalModule {}
