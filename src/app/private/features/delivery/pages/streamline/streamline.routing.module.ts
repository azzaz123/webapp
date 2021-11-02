import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { StreamlineOngoingModule } from './pages/streamline-ongoing/streamline-ongoing.module';
import { StreamlineComponent } from './streamline.component';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

const routes: Route[] = [
  {
    path: '',
    component: StreamlineComponent,
    children: [
      {
        path: STREAMLINE_PATHS.ONGOING,
        loadChildren: () => StreamlineOngoingModule,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StreamlineRoutingModule {}

export const streamlineRoutedComponents = [StreamlineComponent];
