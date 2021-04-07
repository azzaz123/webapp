import { Component, Input } from '@angular/core';

@Component({
  selector: 'tsl-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss'],
})
export class EmptyStateComponent {
  @Input() title: string;
  @Input() description: string;
  @Input() drawingPath: string;
}
