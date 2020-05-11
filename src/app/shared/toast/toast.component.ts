import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../core/toast/toast.service';

@Component({
  selector: 'tsl-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {

  constructor(public toastService:ToastService) { }

  ngOnInit(): void {
  }

}
