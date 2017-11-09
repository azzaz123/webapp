import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item, WindowRef } from 'shield';

@Component({
  selector: 'tsl-upload-confirmation-modal',
  templateUrl: './upload-confirmation-modal.component.html',
  styleUrls: ['./upload-confirmation-modal.component.scss']
})
export class UploadConfirmationModalComponent implements OnInit {

  public item: Item;

  constructor(public activeModal: NgbActiveModal, private window: WindowRef) { }

  ngOnInit() {
  }

  public facebookShare() {
    const url = 'https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=' + encodeURI(this.item.webLink);
    this.window.nativeWindow.open(url, 'fbShareWindow', 'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');

  }

}
