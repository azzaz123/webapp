import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
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

  constructor(private scrollLockService: ScrollLockService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const { isOpen: isOpenSimpleChange } = changes;

    if (isOpenSimpleChange.currentValue !== isOpenSimpleChange.previousValue) {
      this.scrollLockService.changeLockStatus(isOpenSimpleChange.currentValue);
    }
  }
}
