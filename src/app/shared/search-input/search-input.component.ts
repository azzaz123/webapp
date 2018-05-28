import { Component, ElementRef, EventEmitter, HostListener, Output, ViewChild, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'tsl-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss']
})
export class SearchInputComponent implements OnInit {

  public active: boolean = false;
  @ViewChild('input') public input: ElementRef;
  @Output('term') public term$: EventEmitter<string> = new EventEmitter<string>();
  private term: Subject<string> = new Subject<string>();

  constructor(private elementRef: ElementRef) {
    this.term$ = <any>this.term.asObservable()
      .debounceTime(400)
      .distinctUntilChanged();
  }

  ngOnInit() {
  }

  public search(term: string) {
    this.term.next(term);
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: any) {
    const clickedInside: boolean = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && !this.input.nativeElement.value) {
      this.active = false;
    }
  }

}
