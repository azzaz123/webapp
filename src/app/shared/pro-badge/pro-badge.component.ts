import { Component, Input, OnInit } from '@angular/core';

export enum ICON_TYPE {
  SMALL,
  DEFAULT,
  LARGE,
}

@Component({
  selector: 'tsl-pro-badge',
  templateUrl: './pro-badge.component.html',
  styleUrls: ['./pro-badge.component.scss'],
})
export class ProBadgeComponent implements OnInit {
  @Input() IconType = ICON_TYPE.DEFAULT;
  selectedStyle;

  config = {
    [ICON_TYPE.SMALL]: {
      src: '/assets/icons/pro/pro-seal.svg',
    },
    [ICON_TYPE.DEFAULT]: {
      src: '/assets/icons/pro/pro-badge.svg',
      width: 60,
      height: 20,
    },
    [ICON_TYPE.LARGE]: {
      src: '/assets/icons/pro/pro-badge.svg',
      width: 102,
      height: 34,
    },
  };

  ngOnInit() {
    this.selectedStyle = this.config[this.IconType];
  }
}
