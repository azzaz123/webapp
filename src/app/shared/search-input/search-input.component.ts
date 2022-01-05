import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { Component, EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';
import { TRANSLATION_KEY } from '@core/i18n/translations/enum/translation-keys.enum';

@Component({
  selector: 'tsl-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
})
export class SearchInputComponent implements OnChanges {
  @Input() placeholder;
  @Input() onCloseSearch: boolean;
  // eslint-disable-next-line @angular-eslint/no-output-rename
  @Output('term') public term$: EventEmitter<string> = new EventEmitter<string>();
  @Output() deleteSearch: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('input') input: ElementRef;
  private term: Subject<string> = new Subject<string>();

  constructor(i18nService: I18nService) {
    if (!this.placeholder) {
      this.placeholder = i18nService.translate(TRANSLATION_KEY.SEARCH_INPUT_PLACEHOLDER);
    }
    this.term$ = <any>this.term.asObservable().pipe(debounceTime(400), distinctUntilChanged());
  }

  ngOnChanges() {
    if (this.onCloseSearch) {
      this.closeSearch();
    }
  }

  public search(term: string) {
    this.term.next(term);
  }

  public closeSearch(e?: Event): void {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (this.input && this.input.nativeElement.value !== '') {
      this.input.nativeElement.value = '';
      this.deleteSearch.emit();
    }
  }
}
