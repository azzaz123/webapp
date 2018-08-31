import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { TutorialGuard } from '../shared/guards/tutorial.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import * as _ from 'lodash';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoggedGuard, TutorialGuard],
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: ListComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.normal,
            redirectTo: {
              isNormal: (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
                if (_.isEmpty(route.params)) {
                  return '/pro/catalog/list';
                } else {
                  return {
                    navigationCommands: ['/pro/catalog/list', route.params]
                  };
                }
              }
            }
          }
        }
      },
      {
        path: 'checkout',
        component: CheckoutComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.normal,
            redirectTo: {
              isNormal: (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
                if (!route.params.itemId) {
                  return '/pro/catalog/checkout';
                }
                return {
                  navigationCommands: ['/pro/catalog/checkout/', {itemId: route.params.itemId}]
                };
              }
            }
          }
        }
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {
}

export const catalogRoutedComponents = [
  CatalogComponent,
  ListComponent,
  CheckoutComponent,
];
