import { ChangeDetectionStrategy, Component, Input, OnChanges, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { ScrollLockService } from '@public/shared/services/scroll-lock.service';

@Component({
  selector: 'tsl-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerComponent implements OnChanges {
  @Input() isOpen = false;
  @Input() offsetTop = 0;
  @Input() hasApply = false;
  @Input() noScroll = false;
  @Output() apply = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() clickBackdrop = new EventEmitter<void>();

  constructor(private scrollLockService: ScrollLockService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const { isOpen: isOpenSimpleChange } = changes;

    if (isOpenSimpleChange && isOpenSimpleChange.currentValue !== isOpenSimpleChange.previousValue) {
      this.scrollLockService.changeLockStatus(isOpenSimpleChange.currentValue);
    }
  }

  public handleApply(): void {
    this.apply.emit();
  }

  public handleCancel(): void {
    this.cancel.emit();
  }

  public handleClickBackdrop(): void {
    this.clickBackdrop.emit();
  }
}
