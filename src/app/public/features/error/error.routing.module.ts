import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ErrorComponent } from './pages/error.component';

const routes: Route[] = [
  {
    path: '',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ErrorRoutingModule {}

export const errorRoutedComponents = [ErrorComponent];
