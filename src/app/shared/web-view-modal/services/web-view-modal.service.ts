import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { WebViewModalComponent } from '../components/web-view-modal.component';

@Injectable({
  providedIn: 'root',
})
export class WebViewModalService {
  constructor(private modalService: NgbModal) {}

  public open(url: string, title: string, modalClassName: string): Observable<void> {
    const modalref = this.modalService.open(WebViewModalComponent, { backdrop: 'static', windowClass: modalClassName });
    modalref.componentInstance.startUrl = url;
    modalref.componentInstance.title = title;
    modalref.componentInstance.onCloseCallback = modalref.close.bind(modalref);
    return from(modalref.result);
  }
}
