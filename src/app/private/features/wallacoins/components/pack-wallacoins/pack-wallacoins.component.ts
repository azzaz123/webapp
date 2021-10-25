import { Component, EventEmitter, HostBinding, Input, OnInit, Output } from '@angular/core';
import { Pack } from '../../../../../core/payments/pack';

@Component({
  selector: 'tsl-pack-wallacoins',
  templateUrl: './pack-wallacoins.component.html',
  styleUrls: ['./pack-wallacoins.component.scss'],
})
export class PackWallacoinsComponent {
  @Input() pack: Pack;
  @Input() packIndex: number;
  @Output() clickBuy: EventEmitter<any> = new EventEmitter();

  @HostBinding('class.credits') get withCredits(): boolean {
    return this.pack.name === 'wallacredits';
  }
}
