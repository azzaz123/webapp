import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-select-parent-option',
  templateUrl: './select-parent-option.component.html',
  styleUrls: ['./select-parent-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectParentOptionComponent {
  @Input() label: string;
  @Input() sublabel?: string;
  @Input() icon: string;
  @Input() isClearable?: boolean;
  @Output() clear = new EventEmitter<void>();

  public handleClear(event: MouseEvent): void {
    event.stopPropagation();
    this.clear.emit();
  }
}
