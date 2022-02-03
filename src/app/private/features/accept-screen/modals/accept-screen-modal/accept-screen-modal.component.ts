import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptScreenModalComponent implements OnInit {
  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;
  public selectedDropOffPosition: number;

  constructor(private acceptScreenStoreService: AcceptScreenStoreService) {}

  ngOnInit(): void {
    this.acceptScreenStoreService.initialize(this.requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$.pipe(
      filter((acceptScreenProperties: AcceptScreenProperties) => !!acceptScreenProperties),
      tap((acceptScreenProperties: AcceptScreenProperties) => {
        this.selectedDropOffPosition = acceptScreenProperties.carriers.findIndex((carrier: AcceptScreenCarrier) => carrier.isSelected);
      })
    );
  }

  public notifySelectedDropOffModeByUserChanged(newSelectedDropOffPosition: number): void {
    this.acceptScreenStoreService.notifySelectedDropOffModeByUser(newSelectedDropOffPosition);
  }
}
