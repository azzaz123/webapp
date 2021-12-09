import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { TabsBarElement } from '../../interfaces/tabs-bar-element.interface';

@Component({
  selector: 'tsl-tabs-bar',
  templateUrl: './tabs-bar.component.html',
  styleUrls: ['./tabs-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsBarComponent<T> {
  @Input()
  set tabsBarElements(newTabsBarElements: TabsBarElement<T>[]) {
    this.setFirstElementAsSelected(newTabsBarElements);
    this._tabsBarElements$.next(newTabsBarElements);
  }
  @Output() handleOnClick: EventEmitter<TabsBarElement<T>> = new EventEmitter<TabsBarElement<T>>();

  private selectedTabBarElement: TabsBarElement<T>;
  private readonly _tabsBarElements$: ReplaySubject<TabsBarElement<T>[]> = new ReplaySubject<TabsBarElement<T>[]>(1);
  public get tabsBarElements$(): Observable<TabsBarElement<T>[]> {
    return this._tabsBarElements$.asObservable();
  }

  public handleClick(tabBarElement: TabsBarElement<T>): void {
    this.handleOnClick.emit(tabBarElement);
    this.selectedTabBarElement = tabBarElement;
  }

  public isTabBarSelected(tabBarElement: TabsBarElement<T>): boolean {
    return tabBarElement === this.selectedTabBarElement;
  }

  private setFirstElementAsSelected(tabsBarElements: TabsBarElement<T>[]): void {
    const firstElement: TabsBarElement<T> | null = tabsBarElements.length ? tabsBarElements[0] : null;
    this.selectedTabBarElement = firstElement;
  }
}
