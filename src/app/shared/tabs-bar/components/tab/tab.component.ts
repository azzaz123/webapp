import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabComponent<T> {
  @Input() tabsBarElement: TabsBarElement<T>;
  @Input() isSelected = false;
  @Output() onClick: EventEmitter<TabsBarElement<T>> = new EventEmitter<TabsBarElement<T>>();

  public handleClick() {
    this.onClick.emit(this.tabsBarElement);
  }
}
