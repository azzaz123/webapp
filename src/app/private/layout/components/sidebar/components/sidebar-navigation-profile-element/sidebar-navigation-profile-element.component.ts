import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ICON_TYPE } from '@shared/pro-badge/pro-badge.interface';
import { SidebarNavigationProfileElement } from '../../interfaces/sidebar-navigation-profile-element.interface';

@Component({
  selector: 'tsl-sidebar-navigation-profile-element',
  templateUrl: './sidebar-navigation-profile-element.component.html',
  styleUrls: ['./sidebar-navigation-profile-element.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigationProfileElementComponent {
  @Input() element: SidebarNavigationProfileElement;
  @Input() collapsed: boolean;

  public readonly PRO_BADGE_SIZE: ICON_TYPE = ICON_TYPE.SMALL;
}
