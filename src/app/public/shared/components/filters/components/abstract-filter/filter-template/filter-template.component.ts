import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.component';
import { NgbDropdown, NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable } from 'rxjs';

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

  private onDropdownStateChangeSubject = new Subject();

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  public get onDropdownStateChange(): Observable<boolean> {
    return this.onDropdownStateChangeSubject.asObservable();
  }

  constructor(dropdownConfig: NgbDropdownConfig) {
    dropdownConfig.autoClose = false;
  }

  public toggleDropdown(): void {
    this.dropdown.toggle();
    this.onDropdownStateChangeSubject.next(this.dropdown.isOpen());
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
