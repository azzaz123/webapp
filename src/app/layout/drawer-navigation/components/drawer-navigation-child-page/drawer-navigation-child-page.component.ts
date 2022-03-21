import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerNavigationService } from '@layout/drawer-navigation/services/drawer-navigation.service';

@Component({
  selector: 'tsl-drawer-navigation-child-page',
  templateUrl: './drawer-navigation-child-page.component.html',
  styleUrls: ['./drawer-navigation-child-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerNavigationChildPageComponent {
  public readonly navigationElements$ = this.drawerNavigationService.getChildNavigationElements(this.routeUrl);
  public readonly navigationTitle$ = this.drawerNavigationService.getChildNavigationTitle(this.routeUrl);

  constructor(private route: Router, private drawerNavigationService: DrawerNavigationService) {}

  private get routeUrl(): string {
    const url = this.route.url;

    return url.split('/').pop();
  }
}
