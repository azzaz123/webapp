import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormComplexIcon } from '@shared/form/interfaces/form-complex-icon.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICON_STATUS } from './enums/icon-status.enum';

@Component({
  selector: 'tsl-grid-select-option',
  templateUrl: './grid-select-option.component.html',
  styleUrls: ['./grid-select-option.component.scss'],
})
export class GridSelectOptionComponent implements OnInit, OnChanges {
  @Input() icon: string | FormComplexIcon;
  @Input() label?: string;
  @Input() isActive?: boolean;
  @Input() isBig?: boolean;
  @Input() isHoverMainColor?: boolean;

  public BIG_SIZE = 30;
  public SMALL_SIZE = 20;
  public ICON_STATUS = ICON_STATUS;
  private iconStatusSubject = new BehaviorSubject(null);

  public get iconStatus$(): Observable<ICON_STATUS> {
    return this.iconStatusSubject.asObservable();
  }

  public ngOnInit(): void {
    if (!this.isStringIcon(this.icon)) {
      this.getIconStatus();
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const { isActive } = changes;
    if (isActive && !isActive.firstChange && isActive.currentValue !== isActive.previousValue) {
      this.getIconStatus();
    }
  }

  public handleMouseEnter(): void {
    if (!this.isStringIcon(this.icon) && !this.isActive) {
      this.iconStatusSubject.next(ICON_STATUS.HOVER);
    }
  }

  public handleMouseLeave(): void {
    if (!this.isStringIcon(this.icon) && !this.isActive) {
      this.getIconStatus();
    }
  }

  private getIconStatus(): void {
    if (!this.isStringIcon(this.icon)) {
      this.iconStatusSubject.next(this.isActive ? ICON_STATUS.ACTIVE : ICON_STATUS.STANDARD);
    }
  }

  private isStringIcon(icon: string | FormComplexIcon): icon is string {
    return typeof icon === 'string';
  }
}
