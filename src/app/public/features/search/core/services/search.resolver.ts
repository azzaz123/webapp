import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SearchService } from '@public/features/search/core/services/search.service';
import { SearchAdsService } from '../ads/search-ads.service';

@Injectable()
export class SearchResolver implements Resolve<void> {
  constructor(private searchService: SearchService, private searchAdsService: SearchAdsService) {}

  resolve(): void {
    this.searchService.init();
    this.searchAdsService.init();
  }
}
