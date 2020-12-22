import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-favourite-icon',
  templateUrl: './favourite-icon.component.html',
  styleUrls: ['./favourite-icon.component.scss'],
})
export class FavouriteIconComponent {
  @Input() active: boolean = false;
}
