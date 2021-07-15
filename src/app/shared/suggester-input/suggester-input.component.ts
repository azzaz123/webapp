import { Component } from '@angular/core';
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
export class SuggesterInputComponent {
  constructor(public hashtagSuggesterApiService: HashtagSuggesterApiService) {}
  public model: any;
  public options = ['test', 'aa'];
  public keyDown(event) {
    //listen to the key event and debounce
    this.hashtagSuggesterApiService.getHashtagsByPrefix();
  }

  //Filter down non use key

  //key down enter
}
// managemge space key (whether we want to put space in prefix) - AC8
