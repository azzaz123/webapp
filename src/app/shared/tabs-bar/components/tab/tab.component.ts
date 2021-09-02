import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent {
  @Input() tabsBarElement: TabsBarElement;
  @Input() isSelected = false;
}
