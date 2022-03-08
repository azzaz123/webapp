import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YouComponent } from './pages/you.component';

const routes: Routes = [
  {
    path: '',
    component: YouComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YouRoutingModule {}
