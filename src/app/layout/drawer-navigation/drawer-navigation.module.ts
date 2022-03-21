import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerNavigationComponent } from './components/drawer-navigation.component';
import { DrawerNavigationChildPageComponent } from './components/drawer-navigation-child-page/drawer-navigation-child-page.component';
import { DrawerNavigationService } from './services/drawer-navigation.service';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';
import { DrawerNavigationElementComponent } from './components/drawer-navigation-element/drawer-navigation-element.component';
import { DrawerNavigationProfileElementComponent } from './components/drawer-navigation-profile-element/drawer-navigation-profile-element.component';
import { StarsModule } from '@shared/stars/stars.module';
import { UserAvatarModule } from '@shared/user-avatar/user-avatar.module';
import { ProBadgeModule } from '@shared/pro-badge/pro-badge.module';

@NgModule({
  declarations: [
    DrawerNavigationComponent,
    DrawerNavigationChildPageComponent,
    DrawerNavigationElementComponent,
    DrawerNavigationProfileElementComponent,
  ],
  exports: [DrawerNavigationComponent, DrawerNavigationChildPageComponent],
  imports: [CommonModule, SvgIconModule, StarsModule, UserAvatarModule, RouterModule, ProBadgeModule],
  providers: [DrawerNavigationService],
})
export class DrawerNavigationModule {}
