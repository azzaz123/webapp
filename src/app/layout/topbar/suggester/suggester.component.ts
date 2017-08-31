import { Component, OnInit } from '@angular/core';
import { SuggesterResponse } from "../../../core/suggester/suggester-response.interface";
import { Observable } from 'rxjs/Observable';
import { SuggesterService } from '../../../core/suggester/suggester.service';
import { EventService } from '../../../core/event/event.service';

@Component({
  selector: 'tsl-suggester',
  templateUrl: './suggester.component.html',
  styleUrls: ['./suggester.component.scss']
})
export class SuggesterComponent implements OnInit {

  private MIN_LENGTH = 3;
  public focus: boolean;
  public model: any;

  constructor(private suggesterService: SuggesterService,
              private eventService: EventService) { }

  ngOnInit() {
  }

  public suggest = (text$: Observable<string>) =>
    text$
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(term => term.length < this.MIN_LENGTH ? [] :
        this.suggesterService.getSuggestions(term)
          .catch(() => {
            return Observable.of([]);
          }));

  public formatter = (x: any) => x.suggestion;

  public selectSuggestion(result: SuggesterResponse) {
    this.eventService.emit(EventService.UPDATE_SEARCH, result);
  }

}
