import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { PaginatedList } from '@api/core/model/paginated-list.interface';
import { Hashtag } from '@private/features/upload/core/models/hashtag.interface';
import { PaginationResponse } from '@public/core/services/pagination/pagination.interface';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { HashtagSuggesterApiService } from '../../private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';

export const states = [
  { label: 'abc', value: 'abc' },
  { label: 'abcdd', value: 'abcdd' },
  { label: 'accbc', value: 'accbc' },
  { label: 'bsbc', value: 'bsbc' },
];

@Component({
  selector: 'tsl-suggester-input',
  templateUrl: './suggester-input.component.html',
  styleUrls: ['./suggester-input.component.scss'],
})
export class SuggesterInputComponent implements OnInit {
  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {}
  ngOnInit() {
    this.detectTitleKeyboardChanges();
  }
  @Input() categoryId: string = '1000'; // When PR: need to modify
  @ViewChild('hashtagSuggester', { static: true }) hashtagSuggester: ElementRef;
  public start: string = '0';
  public model: any;
  public options = ['test', 'aa'];
  public detectTitleKeyboardChanges() {
    //listen to the key event and debounce
    fromEvent(this.hashtagSuggester.nativeElement, 'keyup')
      .pipe(debounceTime(750))
      .subscribe(() => {
        if (!this.isValidKey()) {
          return;
        } else
          this.getHashtags().subscribe((m) => {
            console.log('mm'), m;
          });
      });

    // Send event to the service prefix
  }

  public isValidKey(): boolean {
    // filter valid key
    return true;
  }

  public getHashtags(): Observable<PaginationResponse<Hashtag>> {
    return this.hashtagSuggesterApiService.getHashtagsByPrefix(this.categoryId, this.start, this.model);
  }

  //Filter down non use key

  //key down enter
}
// managemge space key (whether we want to put space in prefix) - AC8
