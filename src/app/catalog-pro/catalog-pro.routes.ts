import { NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, RouterModule, Routes } from '@angular/router';
import { CatalogProListComponent } from './catalog-pro-list/catalog-pro-list.component';
import { PERMISSIONS } from '../core/user/user';
import { CheckoutExtrasProComponent } from './checkout-extras-pro/checkout-extras-pro.component';
import { CheckoutProComponent } from './checkout-pro/checkout-pro.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { isEmpty } from 'lodash';

export function isProfessionalCatalogPermissions(rejectedPermissionName: string, route: ActivatedRouteSnapshot) {
  if (isEmpty(route.params)) {
    return '/catalog/list';
  } else {
    return {
      navigationCommands: ['/catalog/list', route.params]
    };
  }
}

export const routes: Routes = [
  {
    path: '',
    canActivateChild: [NgxPermissionsGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: CatalogProListComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: {
              isProfessional: isProfessionalCatalogPermissions
            }
          }
        }
      },
      {
        path: 'checkout',
        component: CheckoutProComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/catalog/checkout'
          }
        }
      },
      {
        path: 'checkout-extras',
        component: CheckoutExtrasProComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.professional,
            redirectTo: '/catalog/list'
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatalogProRoutingModule { }

export const catalogProRoutedComponents = [
  CatalogProListComponent,
  CheckoutProComponent,
  CheckoutExtrasProComponent
];
