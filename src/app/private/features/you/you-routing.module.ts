import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DrawerNavigationChildPageComponent } from '@layout/drawer-navigation/components/drawer-navigation-child-page/drawer-navigation-child-page.component';
import { DrawerNavigationComponent } from '@layout/drawer-navigation/components/drawer-navigation.component';
import { YOU_PATHS } from './constants/you-routing.constants';
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
        path: YOU_PATHS.SETTINGS,
        component: DrawerNavigationChildPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class YouRoutingModule {}
