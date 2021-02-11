import { ChangeDetectionStrategy, Component, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';
import { EventEmitter } from 'events';

@Component({
  selector: 'tsl-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() offsetTop = 0;
  @Output() cancel = new EventEmitter<void>();

  constructor(private scrollLockService: ScrollLockService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const { isOpen: isOpenSimpleChange } = changes;

    if (isOpenSimpleChange.currentValue !== isOpenSimpleChange.previousValue) {
      this.scrollLockService.changeLockStatus(isOpenSimpleChange.currentValue);
    }
  }

  public handleCancel(): void {
    this.cancel.emit();
  }
}
