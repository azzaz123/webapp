import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SpinnerModule } from '@shared/spinner/spinner.module';
import { UserPublishedComponent } from './user-published.component';

@NgModule({
  imports: [CommonModule, SpinnerModule],
  declarations: [UserPublishedComponent],
  providers: [],
  exports: [UserPublishedComponent],
})
export class UserPublishedModule {}
