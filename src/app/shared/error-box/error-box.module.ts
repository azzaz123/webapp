import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBoxComponent } from './error-box.component';
import { ButtonModule } from '@shared/button/button.module';

@NgModule({
  imports: [CommonModule, ButtonModule],
  exports: [ErrorBoxComponent],
  declarations: [ErrorBoxComponent],
})
export class ErrorBoxModule {}
