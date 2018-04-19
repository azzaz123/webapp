import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { ListComponent } from './list/list.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { UploadCarComponent } from './upload/upload-car/upload-car.component';
import { UploadComponent } from './upload/upload.component';
import { EditComponent } from './edit/edit.component';
import { ItemResolverService } from './item-resolver.service';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { TutorialGuard } from '../shared/guards/tutorial.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import * as _ from 'lodash';

const routes: Routes = [
  {
    path: 'catalog',
    component: CatalogComponent,
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
        path: 'upload',
        component: UploadComponent,
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.normal,
            redirectTo: '/pro/catalog/upload'
          }
        }
      },
      {
        path: 'edit/:id',
        component: EditComponent,
        canDeactivate: [ExitConfirmGuard],
        resolve: {
          item: ItemResolverService
        },
        data: {
          isMyZone: true,
          isProducts: true,
          permissions: {
            only: PERMISSIONS.normal,
            redirectTo: {
              isNormal: (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
                return '/pro/catalog/edit/' + route.params.id;
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
            redirectTo: '/pro/catalog/checkout'
          }
        }
      },
    ]
  },
  {
    path: 'pro',
    canActivate: [LoggedGuard],
    children: [
      {
        path: 'catalog',
        component: CatalogComponent,
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
                only: PERMISSIONS.professional,
                redirectTo: {
                  isProfessional: (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
                    if (_.isEmpty(route.params)) {
                      return '/catalog/list';
                    } else {
                      return {
                        navigationCommands: ['/catalog/list', route.params]
                      };
                    }
                  }
                }
              }
            }
          },
          {
            path: 'upload',
            component: UploadComponent,
            data: {
              isMyZone: true,
              isProducts: true,
              permissions: {
                only: PERMISSIONS.professional,
                redirectTo: '/catalog/upload'
              }
            }
          },
          {
            path: 'edit/:id',
            component: EditComponent,
            canDeactivate: [ExitConfirmGuard],
            resolve: {
              item: ItemResolverService
            },
            data: {
              isMyZone: true,
              isProducts: true,
              permissions: {
                only: PERMISSIONS.professional,
                redirectTo: {
                  isProfessional: (rejectedPermissionName: string, route: ActivatedRouteSnapshot) => {
                    return '/catalog/edit/' + route.params.id;
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
                only: PERMISSIONS.professional,
                redirectTo: '/catalog/checkout'
              }
            }
          },
        ]
      },
    ]
  }
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
  UploadComponent,
  UploadCarComponent,
  EditComponent,
  CheckoutComponent
];
