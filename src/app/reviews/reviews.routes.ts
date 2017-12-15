import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReviewsComponent } from './reviews.component';
import { LoggedGuard } from '../core/user/logged.guard';

const routes: Routes = [
  {
    path: 'reviews',
    component: ReviewsComponent,
    canActivate: [LoggedGuard]
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
