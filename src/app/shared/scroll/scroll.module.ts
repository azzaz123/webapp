import { NgModule } from '@angular/core';
import { ScrollDirective } from './scroll.directive';

@NgModule({
  declarations: [ScrollDirective],
  exports: [ScrollDirective],
})
export class ScrollModule {}
