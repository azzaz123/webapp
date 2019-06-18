import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-block-send-link',
  templateUrl: './block-send-link.component.html',
  styleUrls: ['./block-send-link.component.scss']
})
export class BlockSendLinkComponent {

  constructor(public activeModal: NgbActiveModal) {
  }
}
