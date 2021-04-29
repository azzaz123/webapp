import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-item-card-placeholder',
  templateUrl: './item-card-placeholder.component.html',
  styleUrls: ['./item-card-placeholder.component.scss'],
})
export class ItemCardPlaceholderComponent {
  @Input() showDescription: boolean = true;
}
