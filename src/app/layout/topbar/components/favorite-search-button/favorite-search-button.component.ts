import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-favorite-search-button',
  templateUrl: './favorite-search-button.component.html',
  styleUrls: ['./favorite-search-button.component.scss'],
})
export class FavoriteSearchButtonComponent {
  @Input() className: string;
  @Input() isActive: boolean;
  @Input() svgSrc: string;

  public onClick() {}
}
