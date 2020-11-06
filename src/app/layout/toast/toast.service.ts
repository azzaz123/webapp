import { Injectable } from '@angular/core';
import { Toast } from './toast.interface';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  public toasts: Toast[] = [];
  constructor() {}

  public show(toast: Toast): void {
    this.toasts.push(toast);
  }

  public remove(toast: Toast): void {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }
}
