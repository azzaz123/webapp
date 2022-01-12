import { Component, HostBinding, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-wallacoin',
  templateUrl: './wallacoin.component.html',
  styleUrls: ['./wallacoin.component.scss'],
})
export class WallacoinComponent {
  @Input() currency: string;
  @Input() color: string;
  @Input() size: string;

  @HostBinding('class.medium') get getSize(): boolean {
    return this.size === 'medium';
  }

  @HostBinding('class.hidden') get hide(): boolean {
    return this.currency !== 'wallacoins';
  }
}
