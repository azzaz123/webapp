import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() bannerSpecifications: NgbAlertConfig;
  @Output() closeClick: EventEmitter<void> = new EventEmitter();
}
