import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewsComponent } from '@features/reviews/pages/reviews.component';
import { InfoComponent } from './pages/info/info.component';
import { PublicProfileComponent } from './pages/public-profile.component';
import { PublishedComponent } from './pages/published/published.component';

const routes: Routes = [
  {
    path: '',
    component: PublicProfileComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'published' },
      {
        path: 'published',
        component: PublishedComponent,
      },
      {
        path: 'reviews',
        component: ReviewsComponent,
      },
      {
        path: 'info',
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
