import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-selector-filter-template',
  templateUrl: './selector-filter-template.component.html',
  styleUrls: ['./selector-filter-template.component.scss'],
})
export class SelectorFilterTemplateComponent {
  @Input() hasContentPlaceholder: boolean;
}
