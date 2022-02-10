import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AcceptScreenCarrier, AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
})
export class AcceptScreenModalComponent implements OnInit {
  public requestId: string;
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;
  public initializeAcceptScreenProperties$: Observable<AcceptScreenProperties>;
  public selectedDropOffPosition: number;

  constructor(private acceptScreenStoreService: AcceptScreenStoreService) {}

  ngOnInit(): void {
    this.initializeAcceptScreenProperties$ = this.acceptScreenStoreService.initialize$(this.requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$.pipe(
      tap((acceptScreenProperties: AcceptScreenProperties) => {
        const carrierSelectedPosition: number = acceptScreenProperties?.carriers?.findIndex(
          (carrier: AcceptScreenCarrier) => carrier.isSelected
        );
        this.selectedDropOffPosition = carrierSelectedPosition;
      })
    );
  }

  public notifySelectedDropOffModeByUserChanged(newSelectedDropOffPosition: number): void {
    this.acceptScreenStoreService.notifySelectedDropOffModeByUser(newSelectedDropOffPosition);
  }
}
