import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'tsl-selector-parent-option',
  templateUrl: './selector-parent-option.component.html',
  styleUrls: ['./selector-parent-option.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorParentOptionComponent {
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
