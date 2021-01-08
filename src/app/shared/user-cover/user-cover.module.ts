import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SanitizedBackgroundModule } from '@shared/sanitized-background/sanitized-background.module';
import { UserCoverComponent } from './user-cover.component';

@NgModule({
  declarations: [UserCoverComponent],
  imports: [CommonModule, SanitizedBackgroundModule],
  exports: [UserCoverComponent],
})
export class UserCoverModule {}
