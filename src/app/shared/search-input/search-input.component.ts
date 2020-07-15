
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import { Component, EventEmitter, Output, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

import { I18nService } from '../../core/i18n/i18n.service';

@Component({
  selector: 'tsl-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnChanges {

  @Input() placeholder;
  @Input() onCloseSearch: boolean;
  @Output('term') public term$: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;
  private term: Subject<string> = new Subject<string>();

  constructor(private i18nService: I18nService) {
    if (!this.placeholder) {
      this.placeholder = i18nService.getTranslations('searchDefault');
    }
    this.term$ = <any>this.term.asObservable().pipe(
      debounceTime(400),
      distinctUntilChanged(),);
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
    console.log('close event ', e);
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.input.nativeElement.value = '';
  }
}
