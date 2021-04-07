import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-select-option',
  templateUrl: './select-option.component.html',
  styleUrls: ['./select-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionComponent {
  @Input() label: string;
  @Input() sublabel?: string;
  @Input() icon: string;
  @Input() isActive?: boolean;
}
