import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StreamlineComponent } from './streamline.component';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreamlineRoutingModule {}

export const streamlineRoutedComponents = [StreamlineComponent];
