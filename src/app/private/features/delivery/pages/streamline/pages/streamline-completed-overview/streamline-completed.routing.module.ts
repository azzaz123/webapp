import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StreamlineCompletedComponent } from './streamline-completed/streamline-completed.component';
import { StreamlineCompletedOverviewComponent } from './streamline-completed-overview.component';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineCompletedOverviewComponent,
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

export const streamlineCompletedRoutedComponents = [StreamlineCompletedOverviewComponent, StreamlineCompletedComponent];
