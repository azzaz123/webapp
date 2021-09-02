import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() onClick: EventEmitter<TabsBarElement> = new EventEmitter<TabsBarElement>();

  public handleClick() {
    this.onClick.emit(this.tabsBarElement);
  }
}
