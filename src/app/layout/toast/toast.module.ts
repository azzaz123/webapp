import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast.component';

@NgModule({
  imports: [CommonModule, NgbToastModule],
  declarations: [ToastComponent],
  exports: [ToastComponent],
})
export class ToastModule {}
