import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterModule } from '@angular/router';

import { CatalogComponent } from './pages/catalog.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { isEmpty } from 'lodash-es';
import { LoggedGuard } from '@core/user/logged.guard';
import { PERMISSIONS } from '@core/user/user-constants';
import { ListComponent } from './pages/list/list.component';
import { BUMPS_PATHS } from '../bumps/bumps-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

export function isNormalCatalogPermissions(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (isEmpty(route.params)) {
    return '/pro/catalog/list';
  } else {
    return {
      navigationCommands: ['/pro/catalog/list', route.params],
    };
  }
}

export const routes: Route[] = [
  {
    path: '',
    canActivate: [LoggedGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            except: PERMISSIONS.professional,
            redirectTo: {
              isProfessional: isNormalCatalogPermissions,
            },
          },
        },
      },
      {
        path: BUMPS_PATHS.CHECKOUT,
        redirectTo: `/${PRIVATE_PATHS.BUMPS}/${BUMPS_PATHS.CHECKOUT}`,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}

export const catalogRoutedComponents = [CatalogComponent, ListComponent];
