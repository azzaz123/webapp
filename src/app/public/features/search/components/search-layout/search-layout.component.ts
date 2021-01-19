import { Component, OnDestroy, OnInit } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { ViewportType } from '@core/viewport/viewport.enum';
import { Subscription } from 'rxjs/internal/Subscription';

// Naming should be abstracted if this component is reused
@Component({
  selector: 'tsl-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss'],
})
export class SearchLayoutComponent implements OnInit, OnDestroy {
  public shouldRenderRightColumn: boolean;
  public shouldRenderBottomRow: boolean;
  private subscription: Subscription;

  constructor(private viewportService: ViewportService) {}

  public ngOnInit(): void {
    this.viewportService.$onViewportChange.subscribe((viewport) => {
      this.shouldRenderBottomRow =
        viewport === ViewportType.XS || viewport === ViewportType.SM;
      this.shouldRenderRightColumn =
        viewport === ViewportType.XL || viewport === ViewportType.XXL;
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
