import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DrawerNavigationProfileElement } from '@layout/drawer-navigation/interfaces/drawer-navigation-element.interface';

@Component({
  selector: 'tsl-drawer-navigation-profile-element',
  templateUrl: './drawer-navigation-profile-element.component.html',
  styleUrls: ['./drawer-navigation-profile-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerNavigationProfileElementComponent {
  @Input() element: DrawerNavigationProfileElement;
}
