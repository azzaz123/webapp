import { NgModule } from '@angular/core';
import { streamlineRoutedComponents, StreamlineRoutingModule } from './streamline.routing.module';

@NgModule({
  imports: [StreamlineRoutingModule],
  declarations: [streamlineRoutedComponents],
})
export class StreamlineModule {}
