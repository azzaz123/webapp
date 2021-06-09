import { Injectable } from '@angular/core';
import { HashtagSuggester } from '../../models/hashtag-suggester.interface';

@Injectable({
  providedIn: 'root',
})
export class HashtagStoreService {
  public selectedSuggesters: HashtagSuggester[] = [];

  constructor() {}

  public addSuggesters(hashtagSuggester: HashtagSuggester): void {
    this.selectedSuggesters = this.selectedSuggesters.concat(hashtagSuggester);
  }

  public deleteSuggesters(hashtagSuggester: HashtagSuggester): void {
    this.selectedSuggesters = this.selectedSuggesters.filter((hashtag) => {
      hashtag !== hashtagSuggester;
    });
  }
}
