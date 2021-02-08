import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.component';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
})
export class FilterTemplateComponent implements AfterViewInit {
  @Input() isBubble?: boolean;
  @Input() isDropdown?: boolean;
  @Input() hasValue?: boolean;
  @Input() label: string;
  @Input() counter?: number;
  @Input() icon?: string;
  @Input() hasCancel?: boolean;
  @Input() hasApply?: boolean;
  @Input() isClearable?: boolean;
  @Output() apply: EventEmitter<void> = new EventEmitter();
  @Output() clear: EventEmitter<void> = new EventEmitter();
  @Output() openStateChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('dropdown', { read: NgbDropdown }) dropdown: NgbDropdown;

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  public ngAfterViewInit(): void {
    if (this.isBubble) {
      this.openStateChange = this.dropdown.openChange;
    }
  }

  public get hasActions(): boolean {
    return this.hasCancel || this.hasApply;
  }

  public handleBubbleClick(event: MouseEvent): void {
    if (this.isDropdown) {
      this.toggleDropdown();
    }
    event.stopPropagation();
  }

  public handleCancel(event: MouseEvent): void {
    this.handleCloseDropdown(event);
  }

  public handleAccept(event: MouseEvent): void {
    this.handleCloseDropdown(event);
    this.apply.emit();
  }

  public handleClear(event: MouseEvent): void {
    this.handleCloseDropdown(event);
    this.clear.emit();
  }

  private toggleDropdown(): void {
    this.dropdown.toggle();
  }

  private handleCloseDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.dropdown.close();
  }
}
