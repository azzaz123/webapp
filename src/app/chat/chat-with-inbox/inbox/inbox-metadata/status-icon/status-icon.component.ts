import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tsl-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss']
})
export class StatusIconComponent {

  @Input() blocked = false;
  @Input() unavailable = false;
}
