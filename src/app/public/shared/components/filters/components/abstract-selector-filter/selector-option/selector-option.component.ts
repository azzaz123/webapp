import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SelectorOptionIcon } from './interfaces/selector-option-icon.interface';

@Component({
  selector: 'tsl-selector-option',
  templateUrl: './selector-option.component.html',
  styleUrls: ['./selector-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorOptionComponent {
  @Input() label: string;
  @Input() sublabel?: string;
  @Input() icon: SelectorOptionIcon;
  @Input() isActive?: boolean;
}
