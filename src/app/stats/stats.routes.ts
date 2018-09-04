import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatsComponent } from './stats.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { ItemsStatsComponent } from './items-stats/items-stats.component';

const routes: Routes = [
  {
    path: '',
    component: StatsComponent,
    canActivate: [LoggedGuard],
    data: {
      isMyZone: true
    },
    children: [
      {
        path: '',
        component: ItemsStatsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatsRoutingModule { }

export const statsRoutedComponents = [StatsComponent];
