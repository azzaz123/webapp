import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabsBarModule } from '@shared/tabs-bar/tabs-bar.module';
import { streamlineRoutedComponents, StreamlineRoutingModule } from './streamline.routing.module';

@NgModule({
  imports: [StreamlineRoutingModule, TabsBarModule, RouterModule],
  declarations: [streamlineRoutedComponents],
})
export class StreamlineModule {}
