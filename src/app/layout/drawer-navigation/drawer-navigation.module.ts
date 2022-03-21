import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';
import { DrawerNavigationSecondaryPageComponent } from './components/drawer-navigation-secondary-page/drawer-navigation-secondary-page.component';
import { DrawerNavigationService } from './services/drawer-navigation.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';
import { DrawerNavigationElementComponent } from './components/drawer-navigation-element/drawer-navigation-element.component';
import { DrawerNavigationProfileElementComponent } from './components/drawer-navigation-profile-element/drawer-navigation-profile-element.component';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';

@NgModule({
  declarations: [
    DrawerNavigationComponent,
    DrawerNavigationSecondaryPageComponent,
    DrawerNavigationElementComponent,
    DrawerNavigationProfileElementComponent,
  ],
  exports: [DrawerNavigationComponent, DrawerNavigationSecondaryPageComponent],
  imports: [CommonModule, SvgIconModule, StarsModule, UserAvatarModule, RouterModule],
  providers: [DrawerNavigationService],
})
export class DrawerNavigationModule {}
