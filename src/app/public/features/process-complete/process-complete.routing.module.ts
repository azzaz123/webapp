import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessCompleteComponent } from './pages/process-complete.component';

export const processCompleteRoutedComponents = [ProcessCompleteComponent];

const routes: Routes = [
  {
    path: '',
    component: ProcessCompleteComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessCompleteRoutingModule {}
