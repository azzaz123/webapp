import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatsComponent } from './stats.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { ItemsStatsComponent } from './items-stats/items-stats.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: '',
    component: StatsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/dashboard'
      }
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
