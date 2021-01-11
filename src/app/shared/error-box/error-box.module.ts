import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBoxComponent } from './error-box.component';

@NgModule({
  imports: [CommonModule],
  exports: [ErrorBoxComponent],
  declarations: [ErrorBoxComponent],
})
export class ErrorBoxModule {}
