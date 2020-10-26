import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { OptionList } from '../utils/option-list';
import { Option } from '../utils/option';


@Component({
  selector: 'tsl-dropdown-list',
  templateUrl: './dropdown-list.component.html',
  styleUrls: ['./dropdown-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DropdownListComponent implements AfterViewInit, OnChanges, OnInit {

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

  @Output() optionClicked = new EventEmitter<Option>();
  @Output() optionsListClick = new EventEmitter<null>();
  @Output() singleFilterClick = new EventEmitter<null>();
  @Output() singleFilterFocus = new EventEmitter<null>();
  @Output() singleFilterInput = new EventEmitter<string>();
  @Output() singleFilterKeydown = new EventEmitter<any>();

  @ViewChild('filterInput') filterInput: any;
  @ViewChild('optionsList') optionsList: any;

  disabledColor: string = '#fff';
  disabledTextColor: string = '9e9e9e';

  constructor(
    public hostElement: ElementRef
  ) { }

  /** Event handlers. **/

  ngOnInit() {
    this.optionsReset();
  }

  ngOnChanges(changes: any) {
    if (changes.hasOwnProperty('optionList')) {
      this.optionsReset();
    }
    if (changes.isLoading && !this.isLoading) {
      this.setView();
    }
  }

  ngAfterViewInit() {
    this.setView();
  }

  private setView():void {
    this.moveHighlightedIntoView();
    if (!this.multiple && this.filterEnabled) {
      this.filterInput?.nativeElement.focus();
    }
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

  /** Initialization. **/

  private optionsReset() {
    this.optionList.filter('');
    this.optionList.highlight();
  }

  moveHighlightedIntoView() {

    let list = this.optionsList?.nativeElement;
    if (!list) { return; }
    let listHeight = list.offsetHeight;

    let itemIndex = this.optionList.getHighlightedIndex();

    if (itemIndex > -1) {
      let item = list.children[0].children[itemIndex];
      let itemHeight = item.offsetHeight;

      let itemTop = itemIndex * itemHeight;
      let itemBottom = itemTop + itemHeight;

      let viewTop = list.scrollTop;
      let viewBottom = viewTop + listHeight;

      if (itemBottom > viewBottom) {
        list.scrollTop = itemBottom - listHeight;
      }
      else if (itemTop < viewTop) {
        list.scrollTop = itemTop;
      }
    }
  }

  private handleOptionsWheel(e: any) {
    let div = this.optionsList?.nativeElement;
    let atTop = div.scrollTop === 0;
    let atBottom = div.offsetHeight + div.scrollTop === div.scrollHeight;

    if (atTop && e.deltaY < 0) {
      e.preventDefault();
    }
    else if (atBottom && e.deltaY > 0) {
      e.preventDefault();
    }
  }
}
