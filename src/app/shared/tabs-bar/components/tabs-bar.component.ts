import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TabsBarElement } from '../interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-tabs-bar',
  templateUrl: './tabs-bar.component.html',
  styleUrls: ['./tabs-bar.component.scss'],
})
export class TabsBarComponent implements OnInit {
  @Input() tabsBarElements: TabsBarElement[] = [];
  @Input() initialSelectedTabBarElement: TabsBarElement;
  @Output() onChange: EventEmitter<TabsBarElement> = new EventEmitter<TabsBarElement>();

  public selectedTabBarElement: TabsBarElement;

  ngOnInit() {
    this.checkDefaultSelectedTabBarElement();
  }

  public handleClick(tabBarElement: TabsBarElement): void {
    this.onChange.emit(tabBarElement);
    this.selectedTabBarElement = tabBarElement;
  }

  public isTabBarSelected(tabBarElement: TabsBarElement): boolean {
    return tabBarElement === this.selectedTabBarElement;
  }

  private checkDefaultSelectedTabBarElement(): void {
    const isInitialTabBarElementDefined = !!this.initialSelectedTabBarElement;
    if (isInitialTabBarElementDefined) {
      this.selectedTabBarElement = Object.assign({}, this.initialSelectedTabBarElement);
      return;
    }

    this.setFirstElementAsSelectedTabBarElement();
  }

  private setFirstElementAsSelectedTabBarElement(): void {
    const hasNoElements = this.tabsBarElements.length === 0;
    if (hasNoElements) {
      this.selectedTabBarElement = null;
      return;
    }
    this.selectedTabBarElement = this.tabsBarElements[0];
  }
}
