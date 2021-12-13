import { NgModule } from '@angular/core';
import { BypassHTMLPipe } from './bypass-html.pipe';

@NgModule({
  declarations: [BypassHTMLPipe],
  exports: [BypassHTMLPipe],
})
export class BypassHTMLModule {}
