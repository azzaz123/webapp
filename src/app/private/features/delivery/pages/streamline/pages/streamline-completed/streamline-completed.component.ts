import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DELIVERY_PATHS } from '@private/features/delivery/delivery-routing-constants';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { Observable } from 'rxjs';
import { StreamlineCompletedUIService } from '../../services/streamline-completed-ui/streamline-completed-ui.service';

@Component({
  selector: 'tsl-streamline-completed',
  templateUrl: './streamline-completed.component.html',
  styleUrls: ['./streamline-completed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineCompletedComponent implements OnInit {
  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  constructor(private streamlineCompletedUIService: StreamlineCompletedUIService, private router: Router) {}

  public get infiniteScrollDisabled(): boolean {
    return this.streamlineCompletedUIService.infiniteScrollDisabled;
  }

  public get loading$(): Observable<boolean> {
    return this.streamlineCompletedUIService.loading$;
  }

  public get historicList$(): Observable<HistoricList> {
    return this.streamlineCompletedUIService.historicList$;
  }

  ngOnInit() {
    this.getItems();
  }

  ngOnDestroy() {
    this.streamlineCompletedUIService.reset();
  }

  public getItems(): void {
    this.streamlineCompletedUIService.getItems();
  }

  // TODO: Implement redirection to TTS
  public onItemClick(historicElement: HistoricElement): void {
    const pathToTransactionTracking = `${PRIVATE_PATHS.DELIVERY}/${DELIVERY_PATHS.TRACKING}/${historicElement.id}`;
    this.router.navigate([pathToTransactionTracking]);
  }
}
