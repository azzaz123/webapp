import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { TabsBarElement } from '../../interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-tabs-bar',
  templateUrl: './tabs-bar.component.html',
  styleUrls: ['./tabs-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBarComponent<T> implements OnChanges {
  @Input() tabsBarElements: TabsBarElement<T>[];
  @Input() initialSelectedTabBarElement: TabsBarElement<T>;
  @Output() handleOnClick: EventEmitter<TabsBarElement<T>> = new EventEmitter<TabsBarElement<T>>();

  private selectedTabBarElement: TabsBarElement<T>;

  ngOnChanges(changes: SimpleChanges) {
    const { initialSelectedTabBarElement } = changes;
    if (initialSelectedTabBarElement) {
      this.setSelectedTabBarElement();
    }
  }

  public handleClick(tabBarElement: TabsBarElement<T>): void {
    this.handleOnClick.emit(tabBarElement);
    this.selectedTabBarElement = tabBarElement;
  }

  public isTabBarSelected(tabBarElement: TabsBarElement<T>): boolean {
    return tabBarElement === this.selectedTabBarElement;
  }

  private setSelectedTabBarElement(): void {
    if (this.initialSelectedTabBarElement) {
      this.selectedTabBarElement = this.initialSelectedTabBarElement;
      return;
    }

    const firstElement: TabsBarElement<T> | null = this.tabsBarElements.length ? this.tabsBarElements[0] : null;
    this.selectedTabBarElement = firstElement;
  }
}
