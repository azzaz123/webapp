import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StreamlineCompletedComponent } from './streamline-completed.component';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineCompletedComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreamlineCompletedRoutingModule {}

export const streamlineCompletedRoutedComponents = [StreamlineCompletedComponent];
