import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProFeaturesComponent } from './pro-features.component';
import { ProModalModule } from '@shared/modals/pro-modal/pro-modal.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';

@NgModule({
  declarations: [ProFeaturesComponent],
  imports: [CommonModule, ProModalModule, ProBadgeModule, ToggleFormModule, ReactiveFormsModule, FormsModule, DropdownModule],
  exports: [ProFeaturesComponent],
})
export class ProFeaturesModule {}
