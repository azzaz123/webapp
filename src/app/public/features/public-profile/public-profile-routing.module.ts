import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AdsResolver } from '@core/ads/resolvers/ads.resolver';
import { PublicProfileComponent } from './pages/public-profile.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { UserInfoModule } from './pages/user-info/user-info.module';
import { UserPublishedComponent } from './pages/user-published/user-published.component';
import { UserPublishedModule } from './pages/user-published/user-published.module';
import { UserReviewsComponent } from './pages/user-reviews/user-reviews.component';
import { UserReviewsModule } from './pages/user-reviews/user-reviews.module';
import { PUBLIC_PROFILE_PATHS } from './public-profile-routing-constants';

const routes: Route[] = [
  {
    path: '',
    component: PublicProfileComponent,
    resolve: {
      ads: AdsResolver,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: PUBLIC_PROFILE_PATHS.PUBLISHED,
      },
      {
        path: PUBLIC_PROFILE_PATHS.PUBLISHED,
        component: UserPublishedComponent,
      },
      {
        path: PUBLIC_PROFILE_PATHS.REVIEWS,
        component: UserReviewsComponent,
      },
      {
        path: PUBLIC_PROFILE_PATHS.INFO,
        component: UserInfoComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicProfileRoutingModule {}

export const publicProfileRoutedComponents = [PublicProfileComponent];

export const publicProfileRoutedModules = [UserInfoModule, UserReviewsModule, UserPublishedModule];
