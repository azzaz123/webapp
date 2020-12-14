import { Component, Input } from '@angular/core';
import { UserStats } from '@core/user/user-stats.interface';

@Component({
  selector: 'tsl-user-stats',
  templateUrl: './user-stats.component.html',
  styleUrls: ['./user-stats.component.scss'],
})
export class UserStatsComponent {
  @Input() userStats: UserStats;
  constructor() {}
}
