import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'chat' },
  {
    path: 'pro',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'help',
        loadChildren: 'app/help/help.module#HelpModule'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'calls',
        loadChildren: 'app/calls/calls.module#CallsModule'
      },
      {
        path: 'profile',
        loadChildren: 'app/profile-pro/profile-pro.module#ProfileProModule'
      }
    ]
  },
  {
    path: 'profile',
    loadChildren: 'app/profile/profile.module#ProfileModule'
  },
  {
    path: 'favorites',
    loadChildren: 'app/favorites/favorites.module#FavoritesModule'
  },
  {
    path: 'reviews',
    loadChildren: 'app/reviews/reviews.module#ReviewsModule'
  },
  {
    path: 'wallacoins',
    loadChildren: 'app/wallacoins/wallacoins.module#WallacoinsModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
