import { Injectable } from '@angular/core';
import { DeviceService } from '@core/device/device.service';
import { BehaviorSubject, Observable } from 'rxjs';

const SIDEBAR_COLLAPSED_PREFERENCE_KEY = 'sidebarCollapsed';

@Injectable()
export class SidebarService {
  private readonly _sidebarCollapsed$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(this.getCollapsedPreference());

  constructor(private deviceService: DeviceService) {}

  get sidebarCollapsed$(): Observable<boolean> {
    return this._sidebarCollapsed$.asObservable();
  }

  public toggleCollapse(): void {
    this.setCollapsedState(!this.sidebarCollapsed);
  }

  private get sidebarCollapsed(): boolean {
    return this._sidebarCollapsed$.getValue();
  }

  private setCollapsedState(state: boolean): void {
    this._sidebarCollapsed$.next(state);
    this.saveCollapsedPreference(state);
  }

  private saveCollapsedPreference(state: boolean): void {
    localStorage.setItem(SIDEBAR_COLLAPSED_PREFERENCE_KEY, state.toString());
  }

  private getCollapsedPreference(): boolean {
    const collapsed: string | null = localStorage.getItem(SIDEBAR_COLLAPSED_PREFERENCE_KEY);

    if (collapsed === null && this.deviceService.isTablet()) {
      return true;
    }
    if (collapsed === 'true') {
      return true;
    }
    if (collapsed === 'false') {
      return false;
    }
    return false;
  }
}
