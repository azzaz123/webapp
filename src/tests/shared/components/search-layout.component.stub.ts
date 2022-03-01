import { Component } from '@angular/core';

@Component({
  selector: 'tsl-search-layout',
  template: `<div class="SearchLayout__container container mb-4">
    <div class="row my-3">
      <div class="col">
        <ng-content select="[top]"></ng-content>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <ng-content select="[main]"></ng-content>
      </div>
      <div class="col d-none d-xl-flex SearchLayout__fixed-width-column">
        <ng-content select="[right]"></ng-content>
      </div>
    </div>
    <div class="row m-3 d-md-none">
      <div class="col">
        <ng-content select="[bottom]"></ng-content>
      </div>
    </div>
  </div> `,
})
export class SearchLayoutStubComponent {}
