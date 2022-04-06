import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-button',
  templateUrl: './favorite-search-button.component.html',
  styleUrls: ['./favorite-search-button.component.scss'],
})
export class FavoriteSearchButtonComponent {
  @Input() className = 'btn-primary';
  @Input() classLoading = 'white';
  @Input() type = 'button';
  @Input() disabled: boolean;
  @Input() loading: boolean;

  constructor() {}
}
