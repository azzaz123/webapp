import {
  AfterViewInit,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  ExistingProvider,
  forwardRef,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownListComponent } from './dropdown-list/dropdown-list.component';
import { OptionList } from './utils/option-list';
import { IOption } from './utils/option.interface';
import { Option } from './utils/option';

export const SELECT_VALUE_ACCESSOR: ExistingProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DropdownComponent),
  multi: true,
};

@Component({
  selector: 'tsl-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [SELECT_VALUE_ACCESSOR],
  encapsulation: ViewEncapsulation.None,
})
export class DropdownComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() options: Array<IOption> = [];
  @Input() isLoading: boolean;

  // Functionality settings.
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;
  @Input() noFilter: number = 0;
  @Input() optionTemplateProperty: string;

  // Text settings.
  @Input() notFoundMsg: string = 'No results found';
  @Input() placeholder: string = '';
  @Input() filterPlaceholder: string = '';

  // Output events.
  @Output() opened = new EventEmitter<null>();
  @Output() closed = new EventEmitter<null>();
  @Output() selected = new EventEmitter<IOption>();
  @Output() deselected = new EventEmitter<IOption | IOption[]>();
  @Output() handleFocus = new EventEmitter<null>();
  @Output() handleBlur = new EventEmitter<null>();
  @Output() noOptionsFound = new EventEmitter<string>();
  @Output() filterInputChanged = new EventEmitter<string>();

  @ViewChild('selection', { static: true }) selectionSpan: ElementRef;
  @ViewChild('dropdown', { static: false }) dropdown: DropdownListComponent;
  @ViewChild('filterInput', { static: false }) filterInput: ElementRef;

  @ContentChild('optionTemplate', { static: false })
  optionTemplate: TemplateRef<any>;
  optionList: OptionList;

  // View state variables.
  hasFocus: boolean = false;
  isOpen: boolean = false;
  isBelow: boolean = true;

  filterEnabled: boolean = true;
  filterInputWidth: number = 1;

  placeholderView: string = '';
  // Width and position for the dropdown container.
  width: number;
  top: number;
  left: number;

  private _value: Array<any> = [];
  private isDisabled: boolean = false;
  private clearClicked: boolean = false;
  private selectContainerClicked: boolean = false;
  private optionListClicked: boolean = false;
  private optionClicked: boolean = false;
  /** Keys. **/

  private KEYS: any = {
    BACKSPACE: 8,
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    UP: 38,
    DOWN: 40,
  };

  constructor(private hostElement: ElementRef) {}

  @HostListener('window:blur')
  onWindowBlur() {
    this._blur();
  }

  @HostListener('window:click')
  onWindowClick() {
    if (!this.selectContainerClicked && (!this.optionListClicked || (this.optionListClicked && this.optionClicked))) {
      this.closeDropdown(this.optionClicked);
      if (!this.optionClicked) {
        this._blur();
      }
    }
    this.clearClicked = false;
    this.selectContainerClicked = false;
    this.optionListClicked = false;
    this.optionClicked = false;
  }

  @HostListener('window:resize')
  onWindowResize() {
    this.updateWidth();
  }

  ngOnInit() {
    this.placeholderView = this.placeholder;
  }
  ngOnChanges(changes: SimpleChanges) {
    this.handleInputChanges(changes);
  }

  ngAfterViewInit() {
    this.updateState();
  }

  onSelectContainerClick(event: any) {
    this.selectContainerClicked = true;
    if (!this.clearClicked) {
      this.toggleDropdown();
    }
  }

  onSelectContainerFocus() {
    this._focus();
  }

  onSelectContainerKeydown(event: any) {
    this.handleSelectContainerKeydown(event);
  }

  onOptionsListClick() {
    this.optionListClicked = true;
  }

  onDropdownOptionClicked(option: Option) {
    this.optionClicked = true;
    this.multiple ? this.toggleSelectOption(option) : this.selectOption(option);
  }

  onSingleFilterClick() {
    this.selectContainerClicked = true;
  }

  onSingleFilterFocus() {
    this._focus();
  }

  onFilterInput(term: string) {
    this.filterInputChanged.emit(term);
    this.filter(term);
  }

  onSingleFilterKeydown(event: any) {
    this.handleSingleFilterKeydown(event);
  }

  onMultipleFilterKeydown(event: any) {
    this.handleMultipleFilterKeydown(event);
  }

  onMultipleFilterFocus() {
    this._focus();
  }

  onClearSelectionClick(event: any) {
    this.clearClicked = true;
    this.clearSelection();
    this.closeDropdown(true);
  }

  onDeselectOptionClick(option: Option) {
    this.clearClicked = true;
    this.deselectOption(option);
  }

  /** API. **/

  // TODO fix issues with global click/key handler that closes the dropdown.
  open() {
    this.openDropdown();
  }

  close() {
    this.closeDropdown(false);
  }

  clear() {
    this.clearSelection();
  }

  select(value: string | Array<string>) {
    this.writeValue(value);
  }

  /** ControlValueAccessor interface methods. **/

  writeValue(value: any) {
    this.value = value;
  }

  registerOnChange(fn: (_: any) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }
  /** View. **/

  _blur() {
    if (this.hasFocus) {
      this.hasFocus = false;
      this.onTouched();
      this.handleBlur.emit(null);
    }
  }

  _focus() {
    if (!this.hasFocus) {
      this.hasFocus = true;
      this.handleBlur.emit(null);
    }
  }

  _focusSelectContainer() {
    this.selectionSpan.nativeElement.focus();
  }
  private onChange = (_: any) => {};
  private onTouched = () => {};

  /** Input change handling. **/

  private handleInputChanges(changes: SimpleChanges) {
    let optionsChanged: boolean = changes.hasOwnProperty('options');
    let noFilterChanged: boolean = changes.hasOwnProperty('noFilter');
    let placeholderChanged: boolean = changes.hasOwnProperty('placeholder');

    if (optionsChanged) {
      this.updateOptionList(changes.options.currentValue);
      this.updateState();
    }
    if (optionsChanged || noFilterChanged) {
      this.updateFilterEnabled();
    }
    if (placeholderChanged) {
      this.updateState();
    }
  }

  private updateOptionList(options: Array<IOption>) {
    this.optionList = new OptionList(options);
    this.optionList.value = this._value;
  }

  private updateFilterEnabled() {
    this.filterEnabled = this.optionList.options.length >= this.noFilter;
  }

  /** Value. **/

  get value(): string | string[] {
    return this.multiple ? this._value : this._value[0];
  }

  set value(v: string | string[]) {
    if (typeof v === 'undefined' || v === null || v === '') {
      v = [];
    } else if (typeof v === 'string') {
      v = [v];
    } else if (!Array.isArray(v)) {
      throw new TypeError('Value must be a string or an array.');
    }

    this.optionList.value = v;
    this._value = v;
    this.updateState();
  }

  private valueChanged() {
    this._value = this.optionList.value;
    this.updateState();
    this.onChange(this.value);
  }

  private updateState() {
    this.placeholderView = this.optionList.hasSelected ? '' : this.placeholder;
    setTimeout(() => {
      this.updateFilterWidth();
    });
  }

  /** Select. **/

  private selectOption(option: Option) {
    if (!option.selected && !option.disabled) {
      this.optionList.select(option, this.multiple);
      this.valueChanged();
      this.selected.emit(option.wrappedOption);
    }
  }

  private deselectOption(option: Option) {
    if (option.selected) {
      this.optionList.deselect(option);
      this.valueChanged();
      this.deselected.emit(option.wrappedOption);

      setTimeout(() => {
        if (this.multiple) {
          this.updatePosition();
          this.optionList.highlight();
          if (this.isOpen) {
            this.dropdown.moveHighlightedIntoView();
          }
        }
      });
    }
  }

  private clearSelection() {
    let selection: Array<Option> = this.optionList.selection;
    if (selection.length > 0) {
      this.optionList.clearSelection();
      this.valueChanged();

      if (selection.length === 1) {
        this.deselected.emit(selection[0].wrappedOption);
      } else {
        this.deselected.emit(selection.map((option) => option.wrappedOption));
      }
    }
  }

  private toggleSelectOption(option: Option) {
    option.selected ? this.deselectOption(option) : this.selectOption(option);
  }

  private selectHighlightedOption() {
    let option: Option = this.optionList.highlightedOption;
    if (option !== null) {
      this.selectOption(option);
      this.closeDropdown(true);
    }
  }

  private deselectLast() {
    let sel: Array<Option> = this.optionList.selection;

    if (sel.length > 0) {
      let option: Option = sel[sel.length - 1];
      this.deselectOption(option);
      this.setMultipleFilterInput(option.label + ' ');
    }
  }

  /** Dropdown. **/

  private toggleDropdown() {
    if (!this.isDisabled) {
      this.isOpen ? this.closeDropdown(true) : this.openDropdown();
    }
  }

  private openDropdown() {
    if (!this.isOpen) {
      this.isOpen = true;
      this.updateWidth();
      setTimeout(() => {
        this.updatePosition();
        if (this.multiple && this.filterEnabled) {
          this.filterInput.nativeElement.focus();
        }
        this.opened.emit(null);
      });
    }
  }

  private closeDropdown(focus: boolean) {
    if (this.isOpen) {
      this.clearFilterInput();
      this.updateFilterWidth();
      this.isOpen = false;
      if (focus) {
        this._focusSelectContainer();
      }
      this.closed.emit(null);
    }
  }

  /** Filter. **/

  private filter(term: string) {
    if (this.multiple) {
      if (!this.isOpen) {
        this.openDropdown();
      }
      this.updateFilterWidth();
    }
    setTimeout(() => {
      let hasShown: boolean = this.optionList.filter(term);
      if (!hasShown) {
        this.noOptionsFound.emit(term);
      }
    });
  }

  private clearFilterInput() {
    if (this.multiple && this.filterEnabled) {
      this.filterInput.nativeElement.value = '';
    }
  }

  private setMultipleFilterInput(value: string) {
    if (this.filterEnabled) {
      this.filterInput.nativeElement.value = value;
    }
  }

  private handleSelectContainerKeydown(event: any) {
    let key = event.which;

    if (this.isOpen) {
      if (key === this.KEYS.ESC || (key === this.KEYS.UP && event.altKey)) {
        this.closeDropdown(true);
      } else if (key === this.KEYS.TAB) {
        this.closeDropdown(event.shiftKey);
        this._blur();
      } else if (key === this.KEYS.ENTER) {
        this.selectHighlightedOption();
      } else if (key === this.KEYS.UP) {
        this.optionList.highlightPreviousOption();
        this.dropdown.moveHighlightedIntoView();
        if (!this.filterEnabled) {
          event.preventDefault();
        }
      } else if (key === this.KEYS.DOWN) {
        this.optionList.highlightNextOption();
        this.dropdown.moveHighlightedIntoView();
        if (!this.filterEnabled) {
          event.preventDefault();
        }
      }
    } else {
      // DEPRICATED --> SPACE
      if (key === this.KEYS.ENTER || key === this.KEYS.SPACE || (key === this.KEYS.DOWN && event.altKey)) {
        /* FIREFOX HACK:
         *
         * The setTimeout is added to prevent the enter keydown event
         * to be triggered for the filter input field, which causes
         * the dropdown to be closed again.
         */
        setTimeout(() => {
          this.openDropdown();
        });
      } else if (key === this.KEYS.TAB) {
        this._blur();
      }
    }
  }

  private handleMultipleFilterKeydown(event: any) {
    let key = event.which;

    if (key === this.KEYS.BACKSPACE) {
      if (this.optionList.hasSelected && this.filterEnabled && this.filterInput.nativeElement.value === '') {
        this.deselectLast();
      }
    }
  }

  private handleSingleFilterKeydown(event: any) {
    let key = event.which;

    if (key === this.KEYS.ESC || key === this.KEYS.TAB || key === this.KEYS.UP || key === this.KEYS.DOWN || key === this.KEYS.ENTER) {
      this.handleSelectContainerKeydown(event);
    }
  }

  private updateWidth() {
    this.width = this.selectionSpan.nativeElement.getBoundingClientRect().width;
  }

  private updatePosition() {
    if (this.dropdown) {
      const hostRect = this.hostElement.nativeElement.getBoundingClientRect();
      const spanRect = this.selectionSpan.nativeElement.getBoundingClientRect();
      const dropRect = this.dropdown.hostElement?.nativeElement.firstElementChild.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const top = spanRect.top - hostRect.top;
      const bottom = hostRect.bottom + dropRect?.height;

      this.isBelow = bottom < windowHeight;
      this.left = spanRect.left - hostRect.left;
      this.top = this.isBelow ? top + spanRect.height : top - dropRect?.height;
    }
  }

  private updateFilterWidth() {
    if (!!this.filterInput) {
      let value: string = this.filterInput.nativeElement.value;
      this.filterInputWidth = value.length === 0 ? 1 + this.placeholderView.length * 10 : 1 + value.length * 10;
    }
  }
}
