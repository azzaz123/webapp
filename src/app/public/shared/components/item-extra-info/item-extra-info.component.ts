import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-item-extra-info',
  templateUrl: './item-extra-info.component.html',
  styleUrls: ['./item-extra-info.component.scss'],
})
export class ItemExtraInfoComponent {
  @Input() extraInfo: string[];
  @Input() isDashStyle = false;
}
