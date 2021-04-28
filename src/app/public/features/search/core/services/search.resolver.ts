import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { SearchService } from '@public/features/search/core/services/search.service';

@Injectable()
export class SearchResolver implements Resolve<void> {
  constructor(private searchService: SearchService) {}

  resolve(): void {
    this.searchService.init();
  }
}
