import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsComponent } from '@features/reviews/pages/reviews.component';
import { InfoComponent } from './pages/info/info.component';
import { PublicProfileComponent } from './pages/public-profile.component';
import { PublishedComponent } from './pages/published/published.component';
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
        component: PublishedComponent,
      },
      {
        path: PUBLIC_PROFILE_PATHS.REVIEWS,
        component: ReviewsComponent,
      },
      {
        path: PUBLIC_PROFILE_PATHS.INFO,
        component: InfoComponent,
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
  PublishedComponent,
  ReviewsComponent,
  InfoComponent,
];
