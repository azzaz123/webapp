import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-item-taxonomies',
  templateUrl: './item-taxonomies.component.html',
  styleUrls: ['./item-taxonomies.component.scss'],
})
export class ItemTaxonomiesComponent {
  @Input() iconPath: string = '/assets/icons/categories/stroke/All.svg';
  @Input() parentTaxonomy: string;
  @Input() childTaxonomy: string;

  public taxonomyIsDefined(taxonomy: string): boolean {
    return taxonomy !== undefined && taxonomy !== null && taxonomy !== '';
  }
}
