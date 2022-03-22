import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ParityScreenComponent } from './pages/parity-screen.component';

const routes: Route[] = [
  {
    path: '',
    component: ParityScreenComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParityScreenRoutingModule {}

export const parityScreenRoutedComponents = [ParityScreenComponent];
