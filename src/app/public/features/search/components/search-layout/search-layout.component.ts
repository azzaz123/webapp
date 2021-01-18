import { Component, OnInit } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { ViewportType } from '@core/viewport/viewport.enum';

// Naming should be abstracted if this component is reused
@Component({
  selector: 'tsl-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss'],
})
export class SearchLayoutComponent implements OnInit {
  public shouldRenderRightColumn: boolean;
  public shouldRenderBottomRow: boolean;

  constructor(private viewportService: ViewportService) {}

  ngOnInit(): void {
    this.viewportService.$onViewportChange.subscribe((viewport) => {
      this.shouldRenderBottomRow =
        viewport === ViewportType.XS || viewport === ViewportType.SM;
      this.shouldRenderRightColumn =
        viewport === ViewportType.XL || viewport === ViewportType.XXL;
    });
  }
}
