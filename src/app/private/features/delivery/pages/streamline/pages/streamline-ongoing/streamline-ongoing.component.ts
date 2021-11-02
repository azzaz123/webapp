import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { HistoricElement } from '@shared/historic-list/interfaces/historic-element.interface';
import { HistoricList } from '@shared/historic-list/interfaces/historic-list.interface';
import { Observable } from 'rxjs';
import { StreamlineOngoingUIService } from '../../services/streamline-ongoing-ui/streamline-ongoing-ui.service';

@Component({
  selector: 'tsl-streamline-ongoing',
  templateUrl: './streamline-ongoing.component.html',
  styleUrls: ['./streamline-ongoing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamlineOngoingComponent implements OnInit, OnDestroy {
  public loadingIconSrc: string = '/assets/icons/spinner.svg';
  public loadingIconSizePixels: number = 32;

  constructor(private streamlineOngoingUIService: StreamlineOngoingUIService) {}

  public get historicList$(): Observable<HistoricList> {
    return this.streamlineOngoingUIService.historicList$;
  }

  public get loading$(): Observable<boolean> {
    return this.streamlineOngoingUIService.loading$;
  }

  ngOnInit(): void {
    this.streamlineOngoingUIService.getItems();
  }

  ngOnDestroy(): void {
    this.streamlineOngoingUIService.reset();
  }

  public onItemClick(historicElement: HistoricElement): void {
    // TODO: redirect to TTS
  }
}
