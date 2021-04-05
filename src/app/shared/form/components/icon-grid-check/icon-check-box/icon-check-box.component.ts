import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-icon-check-box',
  templateUrl: './icon-check-box.component.html',
  styleUrls: ['./icon-check-box.component.scss'],
})
export class IconCheckBoxComponent {
  @Input() icon: string;
  @Input() label?: string;
  @Input() isActive?: boolean;
  @Input() isBig?: boolean;
}
