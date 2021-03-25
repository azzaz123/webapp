import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { SelectorOptionIcon } from '../selector-option/interfaces/selector-option-icon.interface';

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
  @Output() onClick = new EventEmitter<void>();
  @Output() onClear = new EventEmitter<void>();

  public getOptionIcon(): SelectorOptionIcon {
    return this.icon ? { stroke: this.icon } : undefined;
  }

  public handleClick(): void {
    this.onClick.emit();
  }

  public handleClear(): void {
    this.onClear.emit();
  }
}
