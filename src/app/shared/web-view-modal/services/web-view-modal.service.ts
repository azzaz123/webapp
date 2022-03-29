import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable } from 'rxjs';
import { WebViewModalComponent } from '../components/web-view-modal.component';

@Injectable({
  providedIn: 'root',
})
export class WebViewModalService {
  constructor(private modalService: NgbModal) {}

  public open(url: string, modalWidth: number, modalHeight: number, title: string): Observable<void> {
    return this.openWebViewModal(url, modalWidth, modalHeight, title);
  }

  private openWebViewModal(url: string, modalWidth: number, modalHeight: number, title: string): Observable<void> {
    const modalref = this.modalService.open(WebViewModalComponent, { backdrop: 'static' });
    modalref.componentInstance.startUrl = url;
    modalref.componentInstance.width = modalWidth;
    modalref.componentInstance.height = modalHeight;
    modalref.componentInstance.title = title;
    modalref.componentInstance.onCloseCallback = modalref.close.bind(modalref);
    return from(modalref.result);
  }
}
