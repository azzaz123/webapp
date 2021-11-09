import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProModalComponent } from './pro-modal.component';
import { ButtonModule } from '@shared/button/button.module';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ProModalComponent],
  imports: [CommonModule, ButtonModule, SvgIconModule, RouterModule],
})
export class ProModalModule {}
