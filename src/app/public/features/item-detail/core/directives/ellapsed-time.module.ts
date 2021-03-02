import { NgModule } from '@angular/core';
import { EllapsedTimePipe } from './ellapsed-time.pipe';

@NgModule({
  declarations: [EllapsedTimePipe],
  exports: [EllapsedTimePipe],
})
export class EllapsedTimeModule {}
