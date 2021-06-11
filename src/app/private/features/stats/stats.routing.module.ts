import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';

import { NgxPermissionsGuard } from 'ngx-permissions';
import { ItemsStatsComponent } from './components/items-stats/items-stats.component';
import { StatsComponent } from './pages/stats.component';

const routes: Route[] = [
  {
    path: '',
    component: StatsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/dashboard',
      },
    },
    children: [
      {
        path: '',
        component: ItemsStatsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatsRoutingModule {}

export const statsRoutedComponents = [StatsComponent];
