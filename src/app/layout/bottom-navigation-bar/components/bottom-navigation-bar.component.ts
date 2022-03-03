import { Component, OnInit } from '@angular/core';
import { BOTTOM_NAVIGATION_BAR_ELMENTS } from '../constants/bottom-navigation-bar-elements';
import { BottomNavigationBarElement } from '../interfaces/bottom-navigation-bar-element.interface';

@Component({
  selector: 'tsl-bottom-navigation-bar',
  templateUrl: './bottom-navigation-bar.component.html',
  styleUrls: ['./bottom-navigation-bar.component.scss'],
})
export class BottomNavigationBarComponent {
  public navigationElements: BottomNavigationBarElement[] = BOTTOM_NAVIGATION_BAR_ELMENTS;

  constructor() {}
}
