import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StreamlineOngoingComponent } from './streamline-ongoing.component';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineOngoingComponent,
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
export class StreamlineOngoingRoutingModule {}

export const streamlineOngoingRoutedComponents = [StreamlineOngoingComponent];
