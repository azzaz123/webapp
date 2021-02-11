import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ViewportService } from '@core/viewport/viewport.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewportType } from '@core/viewport/viewport.enum';

// Naming should be abstracted if this component is reused
@Component({
  selector: 'tsl-search-layout',
  templateUrl: './search-layout.component.html',
  styleUrls: ['./search-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchLayoutComponent {
  public shouldRenderRightColumn: Observable<boolean>;
  public shouldRenderBottomRow: Observable<boolean>;

  constructor(private viewportService: ViewportService) {
    this.setUpObservables();
  }

  private setUpObservables(): void {
    this.shouldRenderBottomRow = this.viewportService.onViewportChange.pipe(
      map((viewport) => viewport === ViewportType.XS || viewport === ViewportType.SM)
    );

    this.shouldRenderRightColumn = this.viewportService.onViewportChange.pipe(
      map((viewport) => viewport === ViewportType.XL || viewport === ViewportType.XXL)
    );
  }
}
