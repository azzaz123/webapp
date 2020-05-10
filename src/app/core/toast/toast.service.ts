import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastService:ToastrService) { }

  
  success(text:string, title?:string):void {
    if (title == undefined) {
      this.toastService.success(text);
    } else {
      this.toastService.success(text, title);
    }
  }

  error(text:string, title?:string):void {
    if (title == undefined) {
      this.toastService.error(text);
    } else {
      this.toastService.error(text, title);
    }
  }
}
