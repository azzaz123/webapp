import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewsComponent } from './reviews.component';
import { LoggedGuard } from '../core/user/logged.guard';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PERMISSIONS } from '../core/user/user';

const routes: Routes = [
  {
    path: '',
    component: ReviewsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        only: PERMISSIONS.normal,
        redirectTo: '/pro/profile'
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReviewsRoutingModule { }

export const reviewsRoutedComponents = [
  ReviewsComponent
];
