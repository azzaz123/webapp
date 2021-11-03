import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

@Component({
  selector: 'tsl-streamline',
  templateUrl: './streamline.component.html',
  styleUrls: ['./streamline.component.scss'],
})
export class StreamlineComponent implements OnInit {
  // TODO: Use valid copies when ready
  public tabsBarElements: TabsBarElement<STREAMLINE_PATHS>[] = [{ value: STREAMLINE_PATHS.ONGOING, label: 'On going' }];

  constructor(private router: Router) {}

  ngOnInit() {
    const firstTabsBarElement = this.tabsBarElements[0].value;
    this.redirect(firstTabsBarElement);
  }

  public onTabsBarChange(tabsBarElement: TabsBarElement): void {
    this.redirect(tabsBarElement.value);
  }

  private redirect(subroute: string): void {
    const route: string = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.STREAMLINE}/${subroute}`;
    this.router.navigate([route]);
  }
}
