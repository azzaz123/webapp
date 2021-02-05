import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.component';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'tsl-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
  providers: [NgbDropdownConfig],
})
export class FilterTemplateComponent {
  @Input() isBubble?: boolean;
  @Input() isDropdown?: boolean;
  @Input() hasValue?: boolean;
  @Input() label: string;
  @Input() counter?: number;
  @Input() icon?: string;
  @Input() hasCancel?: boolean;
  @Input() hasApply?: boolean;
  @Output() apply: EventEmitter<void> = new EventEmitter();

  @ViewChild('dropdown', { read: NgbDropdown }) dropdown: NgbDropdown;

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  constructor(dropdownConfig: NgbDropdownConfig) {
    dropdownConfig.autoClose = false;
  }

  public toggleDropdown(): void {
    this.dropdown.toggle();
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

  private handleCloseDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.toggleDropdown();
  }
}
