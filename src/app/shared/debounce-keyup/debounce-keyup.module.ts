import { NgModule } from '@angular/core';
import { DebounceKeyupDirective } from './debounce-keyup.directive';

@NgModule({
  declarations: [DebounceKeyupDirective],
  exports: [DebounceKeyupDirective],
})
export class DebounceKeyupModule {}
