import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SuggesterResponse } from "../../../core/suggester/suggester-response.interface";
import { Observable } from 'rxjs/Observable';
import { SuggesterService } from '../../../core/suggester/suggester.service';

@Component({
  selector: 'tsl-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss']
})
export class SuggesterComponent implements OnInit {

  private MIN_LENGTH = 3;
  public focus: boolean;
  public model: any;
  @Output() public newSearch = new EventEmitter<SuggesterResponse>();
  @Output() public newSearchSubmit = new EventEmitter<SuggesterResponse>();
  @ViewChild('kwsEl') kwsEl: ElementRef;

  constructor(private suggesterService: SuggesterService) { }

  ngOnInit() {
  }

  public suggest = (text$: Observable<string>) =>
    text$
      .debounceTime(1000)
      .distinctUntilChanged()
      .switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.suggesterService.getSuggestions(term)
          .catch(() => {
            return Observable.of([]);
          }));

  public formatter = (x: any) => x.suggestion;

  public selectSuggestion(result: SuggesterResponse) {
    this.newSearch.emit(result);
  }

  public searchSubmit() {
    this.newSearchSubmit.emit(this.kwsEl.nativeElement.value);
  }

}
