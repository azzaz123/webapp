import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PRIVATE_PATH_PARAMS } from '@private/private-routing-constants';
import { Observable } from 'rxjs';
import { AcceptScreenProperties } from '../../interfaces';
import { AcceptScreenStoreService } from '../../services/accept-screen-store/accept-screen-store.service';

@Component({
  selector: 'tsl-accept-screen-modal',
  templateUrl: './accept-screen-modal.component.html',
  styleUrls: ['./accept-screen-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcceptScreenModalComponent implements OnInit {
  public acceptScreenProperties$: Observable<AcceptScreenProperties>;

  constructor(private route: ActivatedRoute, private acceptScreenStoreService: AcceptScreenStoreService) {}

  ngOnInit(): void {
    const requestId: string = this.route.snapshot.paramMap.get(PRIVATE_PATH_PARAMS.ID);
    this.acceptScreenStoreService.initialize(requestId);
    this.acceptScreenProperties$ = this.acceptScreenStoreService.properties$;
  }
}
