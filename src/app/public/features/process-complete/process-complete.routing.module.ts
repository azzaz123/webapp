import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PUBLIC_PATH_PARAMS } from '@public/public-routing-constants';
import { ProcessCompleteComponent } from './pages/process-complete.component';

export const processCompleteRoutedComponents = [ProcessCompleteComponent];

const routes: Routes = [
  {
    path: '',
    component: ProcessCompleteComponent,
  },
  {
    path: `:${PUBLIC_PATH_PARAMS.ID}`,
    component: ProcessCompleteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessCompleteRoutingModule {}
