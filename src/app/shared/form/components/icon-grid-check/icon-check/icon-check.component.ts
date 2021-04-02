import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-icon-check',
  templateUrl: './icon-check.component.html',
  styleUrls: ['./icon-check.component.scss'],
})
export class IconCheckComponent {
  @Input() icon: string;
  @Input() label?: string;
  @Input() isBig?: boolean;
}
