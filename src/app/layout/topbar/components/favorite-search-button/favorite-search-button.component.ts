import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SearchBoxValue } from '@layout/topbar/core/interfaces/suggester-response.interface';

@Component({
  selector: 'tsl-favorite-search-button',
  templateUrl: './favorite-search-button.component.html',
  styleUrls: ['./favorite-search-button.component.scss'],
})
export class FavoriteSearchButtonComponent {
  @Input() isActive: boolean;
  @Input() svgSrc: string;

  @Output() public clickedButton = new EventEmitter<boolean>();

  public onClick() {
    this.clickedButton.emit(this.isActive);
  }
}
