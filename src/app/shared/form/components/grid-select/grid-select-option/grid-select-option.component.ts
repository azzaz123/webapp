import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-grid-select-option',
  templateUrl: './grid-select-option.component.html',
  styleUrls: ['./grid-select-option.component.scss'],
})
export class GridSelectOptionComponent {
  @Input() icon: string;
  @Input() label?: string;
  @Input() isActive?: boolean;
  @Input() isBig?: boolean;
}
