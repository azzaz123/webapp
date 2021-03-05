import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-item-taxonomies',
  templateUrl: './item-taxonomies.component.html',
  styleUrls: ['./item-taxonomies.component.scss'],
})
export class ItemTaxonomiesComponent {
  @Input() taxonomies: string[];
}
