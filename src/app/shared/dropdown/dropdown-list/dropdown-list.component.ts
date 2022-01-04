import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { OptionList } from '../utils/option-list';
import { Option } from '../utils/option';

@Component({
  selector: 'tsl-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownListComponent implements AfterViewInit, OnChanges {
  @Input() filterEnabled: boolean;
  @Input() left: number;
  @Input() multiple: boolean;
  @Input() notFoundMsg: string;
  @Input() optionList: OptionList;
  @Input() isBelow: boolean;
  @Input() top: number;
  @Input() width: number;
  @Input() placeholder: string;
  @Input() isLoading: boolean;
  @Input() optionTemplate: TemplateRef<any>;

  @Output() optionClicked = new EventEmitter<Option>();
  @Output() optionsListClick = new EventEmitter<null>();
  @Output() singleFilterClick = new EventEmitter<null>();
  @Output() singleFilterFocus = new EventEmitter<null>();
  @Output() singleFilterInput = new EventEmitter<string>();
  @Output() singleFilterKeydown = new EventEmitter<any>();

  @ViewChild('filterInput') filterInput: any;
  @ViewChild('optionsList') optionsList: any;

  constructor(public hostElement: ElementRef) {}

  ngOnChanges(changes: any) {
    if (!this.isLoading && changes.optionList) {
      this.optionsReset();
    }
    if (changes.isLoading && !this.isLoading) {
      setTimeout(() => this.setView(), 1);
    }
  }

  ngAfterViewInit() {
    this.optionsReset();
    this.setView();
  }

  onOptionsListClick() {
    this.optionsListClick.emit(null);
  }

  onSingleFilterClick() {
    this.singleFilterClick.emit(null);
  }

  onSingleFilterInput(event: any) {
    this.singleFilterInput.emit(event.target.value);
  }

  onSingleFilterKeydown(event: any) {
    this.singleFilterKeydown.emit(event);
  }

  onSingleFilterFocus() {
    this.singleFilterFocus.emit(null);
  }

  onOptionsWheel(event: any) {
    this.handleOptionsWheel(event);
  }

  onOptionMouseover(option: Option) {
    this.optionList.highlightOption(option);
  }

  onOptionClick(option: Option) {
    this.optionClicked.emit(option);
  }

  moveHighlightedIntoView() {
    const list = this.optionsList?.nativeElement;
    if (!list) {
      return;
    }
    const listHeight = list.offsetHeight;

    const itemIndex = this.optionList.getHighlightedIndex();

    if (itemIndex > -1) {
      const item = list.children[0].children[itemIndex];
      const itemHeight = item.offsetHeight;

      const itemTop = itemIndex * itemHeight;
      const itemBottom = itemTop + itemHeight;

      const viewTop = list.scrollTop;
      const viewBottom = viewTop + listHeight;

      if (itemBottom > viewBottom) {
        list.scrollTop = itemBottom - listHeight;
      } else if (itemTop < viewTop) {
        list.scrollTop = itemTop;
      }
    }
  }
  /** Initialization. **/

  private optionsReset() {
    if (!this.optionList) {
      return;
    }
    this.optionList.filter('');
    this.optionList.highlight();
  }

  private setView(): void {
    this.moveHighlightedIntoView();
    if (!this.multiple && this.filterEnabled) {
      this.filterInput?.nativeElement.focus();
    }
  }

  private handleOptionsWheel(e: any) {
    const div = this.optionsList?.nativeElement;
    const atTop = div.scrollTop === 0;
    const atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

    if (atTop && e.deltaY < 0) {
      e.preventDefault();
    } else if (atBottom && e.deltaY > 0) {
      e.preventDefault();
    }
  }
}
