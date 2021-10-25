import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProFeaturesComponent } from './pro-features.component';
import { ProModalModule } from '@shared/modals/pro-modal/pro-modal.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwitchModule } from '@shared/switch/switch.module';

@NgModule({
  declarations: [ProFeaturesComponent],
  imports: [CommonModule, ProModalModule, ProBadgeModule, SwitchModule, ReactiveFormsModule, FormsModule],
  exports: [ProFeaturesComponent],
})
export class ProFeaturesModule {}
