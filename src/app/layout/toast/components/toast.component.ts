import { Component } from '@angular/core';
import { ToastService } from '../core/services/toast.service';

@Component({
  selector: 'tsl-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
