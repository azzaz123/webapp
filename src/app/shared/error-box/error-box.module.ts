import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorBoxComponent } from './error-box.component';
import { ButtonModule } from '@shared/button/button.module';
import { ErrorBoxBtnClassNamePipe } from './core/pipes/error-box-btn-class-name.pipe';

@NgModule({
  imports: [CommonModule, ButtonModule],
  exports: [ErrorBoxComponent],
  declarations: [ErrorBoxComponent, ErrorBoxBtnClassNamePipe],
})
export class ErrorBoxModule {}
