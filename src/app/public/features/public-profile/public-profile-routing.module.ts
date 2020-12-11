import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicProfileComponent } from './pages/public-profile.component';
import { UserInfoComponent } from './pages/user-info/user-info.component';
import { UserPublishedComponent } from './pages/user-published/user-published.component';
import { UserReviewsComponent } from './pages/user-reviews/user-reviews.component';
import { PUBLIC_PROFILE_PATHS } from './public-profile-routing-constants';

const routes: Routes = [
  {
    path: '',
    component: PublicProfileComponent,
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

export const publicProfileRoutedComponents = [
  PublicProfileComponent,
  UserPublishedComponent,
  UserReviewsComponent,
  UserInfoComponent,
];
