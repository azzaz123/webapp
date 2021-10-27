import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { DELIVERY_PATHS } from '../../delivery-routing-constants';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

@Component({
  selector: 'tsl-streamline',
  templateUrl: './streamline.component.html',
  styleUrls: ['./streamline.component.scss'],
})
export class StreamlineComponent implements OnInit {
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const firstTabsBarElement = this.tabsBarElements[0].value;
    this.redirect(firstTabsBarElement);
  }

  public tabsBarElements: TabsBarElement[] = [{ label: 'On going', value: STREAMLINE_PATHS.ONGOING }];

  public onTabsBarChange(tabsBarElement: TabsBarElement): void {
    this.redirect(tabsBarElement.value);
  }

  private redirect(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }
}
