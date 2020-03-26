
import {of as observableOf,  Observable } from 'rxjs';

import {distinctUntilChanged, catchError, switchMap} from 'rxjs/operators';
import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SuggesterResponse } from './suggester-response.interface';

import { SuggesterService } from './suggester.service';

@Component({
  selector: 'tsl-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss']
})
export class SuggesterComponent implements OnInit {

  private MIN_LENGTH = 1;
  public focus: boolean;
  public model: any;
  @Output() public newSearch = new EventEmitter<SuggesterResponse>();
  @Output() public newSearchSubmit = new EventEmitter<SuggesterResponse>();
  @Output() public newKeyword = new EventEmitter<string>();
  @ViewChild('kwsEl') kwsEl: ElementRef;

  constructor(private suggesterService: SuggesterService) { }

  ngOnInit() {
  }

  public suggest = (text$: Observable<string>) =>
    text$.pipe(
      distinctUntilChanged(),
      switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.suggesterService.getSuggestions(term).pipe(
          catchError(() => {
            return observableOf([]);
          }))),)

  public formatter = (x: any) => x.suggestion;

  public selectSuggestion(result: SuggesterResponse) {
    this.newSearch.emit(result);
  }

  public updateKeyword() {
    this.newKeyword.emit(this.kwsEl.nativeElement.value);
  }

  public searchSubmit() {
    this.newSearchSubmit.emit(this.kwsEl.nativeElement.value);
  }
}
