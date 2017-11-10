import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-preview-modal',
  templateUrl: './preview-modal.component.html',
  styleUrls: ['./preview-modal.component.scss']
})
export class PreviewModalComponent implements OnInit {

  public itemPreview: any;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    console.log(this.itemPreview);
  }

}
