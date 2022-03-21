import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { DrawerNavigationService } from '@layout/drawer-navigation/services/drawer-navigation.service';

@Component({
  selector: 'tsl-drawer-navigation-secondary-page',
  templateUrl: './drawer-navigation-secondary-page.component.html',
  styleUrls: ['./drawer-navigation-secondary-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerNavigationSecondaryPageComponent {
  public readonly navigationElements$ = this.drawerNavigationService.getChildNavigationElements(this.routeUrl);
  public readonly navigationTitle$ = this.drawerNavigationService.getChildNavigationTitle(this.routeUrl);

  constructor(private route: Router, private drawerNavigationService: DrawerNavigationService) {}

  private get routeUrl(): string {
    const url = this.route.url;

    return url.split('/').pop();
  }
}
