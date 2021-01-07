import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastComponent } from './components/toast.component';
import { ToastService } from './core/services/toast.service';

@NgModule({
  imports: [CommonModule, NgbToastModule],
  declarations: [ToastComponent],
  providers: [ToastService],
  exports: [ToastComponent],
})
export class ToastModule {}
