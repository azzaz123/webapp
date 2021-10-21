import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProFeaturesComponent } from './pro-features.component';
import { ProModalModule } from '@shared/modals/pro-modal/pro-modal.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [ProFeaturesComponent],
  imports: [CommonModule, ProModalModule, ProBadgeModule, SharedModule],
  exports: [ProFeaturesComponent],
})
export class ProFeaturesModule {}
