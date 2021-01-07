import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WallComponent } from './pages/wall.component';

const routes: Routes = [
  {
    path: '',
    component: WallComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WallRoutingModule {}
