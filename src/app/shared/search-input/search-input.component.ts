import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'tsl-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent {

  @Input() placeholder = 'Search Items';
  @Output('term') public term$: EventEmitter<string> = new EventEmitter<string>();
  private term: Subject<string> = new Subject<string>();

  constructor(private elementRef: ElementRef) {
    this.term$ = <any>this.term.asObservable()
      .debounceTime(400)
      .distinctUntilChanged();
  }

  public search(term: string) {
    this.term.next(term);
  }
}
