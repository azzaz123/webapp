import { Component, EventEmitter, Output } from '@angular/core';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';

@Component({
  selector: 'tsl-suggester',
  template: '',
})
export class SuggesterStubComponent {
  @Output() public searchSubmit = new EventEmitter<SearchBoxValue>();
  @Output() public searchCancel = new EventEmitter<SearchBoxValue>();
}
