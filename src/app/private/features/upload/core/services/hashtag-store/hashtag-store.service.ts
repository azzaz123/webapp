import { Injectable } from '@angular/core';
import { Hashtag } from '../../models/hashtag-suggester.interface';

@Injectable({
  providedIn: 'root',
})
export class HashtagStoreService {
  public selectedHashtags: Hashtag[] = [];

  constructor() {}

  public getSelectedHashtags(): Hashtag[] {
    return this.selectedHashtags;
  }

  public addHashtag(hashtagSuggester: Hashtag): void {
    this.selectedHashtags = this.selectedHashtags.concat(hashtagSuggester);
  }

  public deleteHashtag(hashtagSuggester: Hashtag): void {
    this.selectedHashtags = this.selectedHashtags.filter((hashtag) => {
      hashtag.text !== hashtagSuggester.text;
    });
  }
}
