import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { PublicFooterService } from './core/services/footer/public-footer.service';

@Component({
  selector: 'tsl-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit {
  public showFooter$: Observable<boolean> = this.publicFooterService.showFooter$;

  constructor(private analyticsService: AnalyticsService, private publicFooterService: PublicFooterService) {}

  public ngOnInit(): void {
    this.initializeServices();
  }

  private initializeServices(): void {
    this.analyticsService.initialize();
  }
}
