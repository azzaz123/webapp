import { Component, Input, OnInit } from '@angular/core';
import { PUBLIC_PROFILE_PATHS } from '../../public-profile-routing-constants';
import { ProfileTab, PROFILE_TABS } from './constants/profile-tab-constants';

@Component({
  selector: 'tsl-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss'],
})
export class ProfileTabsComponent implements OnInit {
  readonly PROFILE_TABS = PROFILE_TABS;
  readonly INFO_TAB_PATH = PUBLIC_PROFILE_PATHS.INFO;

  @Input() userStats = {};

  constructor() {}

  ngOnInit(): void {
    PROFILE_TABS.map((tab: ProfileTab) => {
      tab.count = this.userStats[tab.id] || 0;
    });
  }
}
