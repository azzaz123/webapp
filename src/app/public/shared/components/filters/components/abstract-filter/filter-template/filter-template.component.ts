import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BUBBLE_VARIANT } from '@public/shared/components/bubble/bubble.component';

@Component({
  selector: 'tsl-filter-template',
  templateUrl: './filter-template.component.html',
  styleUrls: ['./filter-template.component.scss'],
})
export class FilterTemplateComponent {
  @Input() isDropdown: boolean;
  @Input() hasValue: boolean;
  @Input() label: string;
  @Input() counter: number;
  @Input() icon: string;
  @Output() bubbleClick: EventEmitter<void> = new EventEmitter();

  public BUBBLE_VARIANT = BUBBLE_VARIANT;

  public handleBubbleClick(): void {
    this.bubbleClick.emit();
  }
}
