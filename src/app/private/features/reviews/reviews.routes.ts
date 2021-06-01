import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { LoggedGuard } from 'app/core/user/logged.guard';
import { PERMISSIONS } from 'app/core/user/user-constants';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ReviewsComponent } from './pages/reviews.component';

const routes: Route[] = [
  {
    path: '',
    component: ReviewsComponent,
    canActivate: [LoggedGuard, NgxPermissionsGuard],
    data: {
      isMyZone: true,
      permissions: {
        except: PERMISSIONS.professional,
        redirectTo: '/pro/profile',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewsRoutingModule {}

export const reviewsRoutedComponents = [ReviewsComponent];
