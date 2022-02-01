import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BannerSpecifications } from './banner-specifications.interface';

@Component({
  selector: 'tsl-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss'],
})
export class BannerComponent {
  @Input() specifications: BannerSpecifications;
  @Output() closeClick: EventEmitter<void> = new EventEmitter();
}
