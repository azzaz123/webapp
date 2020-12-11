import { Component, OnInit } from '@angular/core';
import { PROFILE_TABS } from './constants/profile-tab-constants';

@Component({
  selector: 'tsl-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss'],
})
export class ProfileTabsComponent implements OnInit {
  readonly PROFILE_TABS = PROFILE_TABS;
  constructor() {}

  ngOnInit(): void {}
}
