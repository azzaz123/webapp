import { NgModule } from '@angular/core';
import { RouterModule, Routes, ActivatedRouteSnapshot } from '@angular/router';

import { ListComponent } from './list/list.component';
import { CatalogProListComponent } from '../catalog/catalog-pro/catalog-pro-list/catalog-pro-list.component'
import { LoggedGuard } from '../core/user/logged.guard';
import { CatalogComponent } from './catalog.component';
import { CatalogProComponent } from '../catalog/catalog-pro/catalog-pro.component';
import { UploadCarComponent } from './upload/upload-car/upload-car.component';
import { UploadComponent } from './upload/upload.component';
import { EditComponent } from './edit/edit.component';
import { ItemResolverService } from './item-resolver.service';
import { ExitConfirmGuard } from '../shared/guards/exit-confirm.guard';
import { TutorialGuard } from '../shared/guards/tutorial.guard';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';
import { CheckoutProComponent } from './checkout/checkout-pro/checkout-pro.component';
import * as _ from 'lodash';
import { CheckoutExtrasProComponent } from './checkout/checkout-extras-pro/checkout-extras-pro.component';

const routes: Routes = [
  {
    path: 'catalog',
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
                return {
                  navigationCommands: ['/pro/catalog/edit/', route.params.id]
                };
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
                    return {
                      navigationCommands: ['/catalog/edit/', route.params.id]
                    };
                  }
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
  CheckoutComponent,
  CatalogProComponent,
  CatalogProListComponent
];
