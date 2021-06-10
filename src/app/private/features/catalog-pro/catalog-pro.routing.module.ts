import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, Route, RouterModule } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { isEmpty } from 'lodash-es';
import { PERMISSIONS } from '@core/user/user-constants';
import { CatalogProListComponent } from './pages/catalog-pro-list/catalog-pro-list.component';
import { CheckoutExtrasProComponent } from './pages/checkout-extras-pro/checkout-extras-pro.component';
import { CheckoutProComponent } from './pages/checkout-pro/checkout-pro.component';

export function getRedirectToCatalogList(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (isEmpty(route.params)) {
    return '/catalog/list';
  } else {
    return {
      navigationCommands: ['/catalog/list', route.params],
    };
  }
}

export const routes: Route[] = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: CatalogProListComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: getRedirectToCatalogList,
          },
        },
      },
      {
        path: 'checkout',
        component: CheckoutProComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.bumps,
            except: PERMISSIONS.normal,
            redirectTo: {
              [PERMISSIONS.normal]: '/catalog/checkout',
              default: '',
            },
          },
        },
      },
      {
        path: 'checkout-extras',
        component: CheckoutExtrasProComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/catalog/list',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogProRoutingModule {}

export const catalogProRoutedComponents = [CatalogProListComponent, CheckoutProComponent, CheckoutExtrasProComponent];
