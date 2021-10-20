import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProModalComponent } from './pro-modal.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  declarations: [ProModalComponent],
  imports: [CommonModule, ButtonModule],
})
export class ProModalModule {}
