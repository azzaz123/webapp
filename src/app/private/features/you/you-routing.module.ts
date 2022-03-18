import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerNavigationSecondaryPageComponent } from '@layout/drawer-navigation/components/drawer-navigation-secondary-page/drawer-navigation-secondary-page.component';
import { DrawerNavigationComponent } from '@layout/drawer-navigation/components/drawer-navigation.component';
import { YouComponent } from './pages/you.component';

const routes: Routes = [
  {
    path: '',
    component: YouComponent,
    children: [
      {
        path: '',
        component: DrawerNavigationComponent,
      },
      {
        path: 'settings',
        component: DrawerNavigationSecondaryPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YouRoutingModule {}
