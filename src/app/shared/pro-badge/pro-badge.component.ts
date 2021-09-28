import { Component, Input, OnInit } from '@angular/core';
import { IconConfig, ICON_TYPE } from './pro-badge.interface';

@Component({
  selector: 'tsl-pro-badge',
  templateUrl: './pro-badge.component.html',
  styleUrls: ['./pro-badge.component.scss'],
})
export class ProBadgeComponent implements OnInit {
  @Input() IconType = ICON_TYPE.DEFAULT;
  public selectedType: IconConfig;

  private readonly config: Record<ICON_TYPE, IconConfig> = {
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
    this.selectedType = this.config[this.IconType];
  }
}
