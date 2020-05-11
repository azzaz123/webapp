import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts:any[]=[];
  constructor(private toastService:ToastrService) { }

  
  success(text:string, title?:string):void {
    if (title == undefined) {
      this.toasts.push({ text,  ...{ classname: 'bg-success text-light', delay: 10000 } });
      this.toastService.success(text);
    } else {
      this.toasts.push({ text, title });
      this.toastService.success(text, title);
    }
  }

  error(text:string, title?:string):void {
    if (title == undefined) {
      this.toasts.push({ text, ...{ classname: 'bg-danger  text-light', delay: 10000 } });
      this.toastService.error(text);
    } else {
      this.toasts.push({ text, title });
      this.toastService.error(text, title);
    }
  }
}
