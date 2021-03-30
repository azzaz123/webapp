import { Component } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';

@Component({
  selector: 'tsl-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent {
  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit() {
    this.initializeServices();
  }

  private initializeServices(): void {
    this.analyticsService.initialize();
  }
}
