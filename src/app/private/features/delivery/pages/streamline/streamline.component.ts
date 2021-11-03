import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsBarElement } from '@shared/tabs-bar/interfaces/tabs-bar-element.interface';
import { STREAMLINE_PATHS } from './streamline.routing.constants';

@Component({
  selector: 'tsl-streamline',
  templateUrl: './streamline.component.html',
  styleUrls: ['./streamline.component.scss'],
})
export class StreamlineComponent implements OnInit {
  // TODO: Use valid copies when ready
  public tabsBarElements: TabsBarElement<STREAMLINE_PATHS>[] = [{ value: STREAMLINE_PATHS.ONGOING, label: 'On going' }];

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    const firstTabsBarElement = this.tabsBarElements[0].value;
    this.redirect(firstTabsBarElement);
  }

  public onTabsBarChange(tabsBarElement: TabsBarElement): void {
    this.redirect(tabsBarElement.value);
  }

  private redirect(route: string): void {
    this.router.navigate([route], { relativeTo: this.activatedRoute });
  }
}
